import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "../models/payment.js";
import Order from "../models/order.js";
import User from "../models/users.js";
import Product from "../models/product.js";
import { sendOrderConfirmationEmail } from "../utils/emailService.js";

const CURRENCY = "INR";
const isProduction = process.env.NODE_ENV === "production";

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are not configured in environment variables");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const toPaise = (amount) => Math.round(Number(amount) * 100);
const toRupees = (amountInPaise) => Number((Number(amountInPaise) / 100).toFixed(2));
const safeCompareSignature = (a, b) => {
  if (!a || !b || a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

const getReadableError = (error, fallback) => {
  const razorpayDescription = error?.error?.description || error?.description;
  const generic = error?.message || fallback;
  return razorpayDescription || generic || fallback;
};

export const createOrder = async (req, res) => {
  try {
    const { items, discountAmount, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    let calculatedSubtotal = 0;
    const cartItems = [];

    for (const item of items) {
      const pId = item.productId || item._id;
      if (!pId) {
        return res.status(400).json({ message: "Product ID is required for all items" });
      }

      const product = await Product.findById(pId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${pId}` });
      }

      const qty = Number(item.quantity) || 1;
      if (qty <= 0) {
        return res.status(400).json({ message: `Invalid quantity for product: ${product.name}` });
      }

      calculatedSubtotal += product.price * qty;

      cartItems.push({
        productId: product._id,
        quantity: qty,
        name: product.name,
        price: product.price,
        image: product.image,
        variant: {
          color: item.color || (item.variant && item.variant.color),
          storage: item.size || (item.variant && item.variant.storage) || item.storage,
        },
      });
    }

    const discount = Number(discountAmount) || 0;
    if (discount < 0) {
      return res.status(400).json({ message: "Invalid discount amount" });
    }

    // Apply 18% tax (GST)
    const calculatedTotal = Number(((calculatedSubtotal - discount) * 1.18).toFixed(2));
    if (calculatedTotal <= 0) {
      return res.status(400).json({ message: "Calculated total must be greater than zero" });
    }

    const amountInPaise = toPaise(calculatedTotal);
    const razorpay = getRazorpayClient();

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: CURRENCY,
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      user: req.user.userId,
      razorpayOrderId: order.id,
      amount: calculatedTotal,
      currency: order.currency,
      status: "Pending",
      cartItems,
      discountAmount: discount,
      shippingAddress,
    });

    return res.status(201).json({
      order_id: order.id,
      amount: amountInPaise,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      status: "Pending",
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    const message = getReadableError(error, "Unable to create payment order");
    const statusCode = error?.statusCode || error?.status || 500;
    return res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
      message,
      ...(isProduction ? {} : { debug: error?.error || error?.stack || null }),
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification fields" });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay secret key is not configured" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = safeCompareSignature(generatedSignature, razorpay_signature);

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found for this order" });
    }

    if (String(payment.user) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Unauthorized payment verification request" });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = isAuthentic ? "Paid" : "Failed";
    payment.failureReason = isAuthentic ? null : "Signature verification failed";
    await payment.save();

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const existingOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!existingOrder && payment.cartItems?.length > 0) {
      const newOrder = await Order.create({
        user: req.user.userId,
        products: payment.cartItems.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          image: item.image,
          variant: item.variant ? {
            color: item.variant.color,
            storage: item.variant.storage,
          } : undefined,
        })),
        totalAmount: payment.amount,
        discountAmount: payment.discountAmount || 0,
        shippingAddress: payment.shippingAddress,
        status: "Processing",
        razorpayOrderId: razorpay_order_id,
      });

      // Deduct stock of variants
      for (const item of payment.cartItems) {
        try {
          const product = await Product.findById(item.productId);
          if (product && product.variants && product.variants.length > 0) {
            let variantIndex = -1;
            if (item.variant && (item.variant.color || item.variant.storage)) {
              variantIndex = product.variants.findIndex(
                v => 
                  (!item.variant.color || v.color === item.variant.color) &&
                  (!item.variant.storage || (v.size || v.storage) === item.variant.storage)
              );
            }
            if (variantIndex !== -1) {
              const countInStock = product.variants[variantIndex].countInStock || 0;
              product.variants[variantIndex].countInStock = Math.max(0, countInStock - item.quantity);
              await product.save();
            } else {
              console.warn(`Variant not found for stock deduction: product ${item.productId}, variant:`, item.variant);
            }
          }
        } catch (stockErr) {
          console.error("Deduct stock error for product:", item.productId, stockErr);
        }
      }

      try {
        const user = await User.findById(req.user.userId);
        if (user) {
          await sendOrderConfirmationEmail(
            user.email,
            user.name,
            newOrder._id,
            payment.cartItems,
            payment.amount
          );
        }
      } catch (emailError) {
        console.error("Error sending order confirmation email:", emailError);
      }
    }

    return res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: payment.status,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    const message = getReadableError(error, "Unable to verify payment");
    return res.status(500).json({
      message,
      ...(isProduction ? {} : { debug: error?.error || error?.stack || null }),
    });
  }
};

export const handlePaymentWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(500).json({ message: "Webhook secret is not configured" });
    }

    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      return res.status(400).json({ message: "Missing Razorpay webhook signature" });
    }

    const body = req.body;
    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");

    const isValid = safeCompareSignature(expectedSignature, signature);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const payload = JSON.parse(body.toString("utf-8"));
    const event = payload.event;

    if (event === "payment.captured") {
      const paymentEntity = payload.payload?.payment?.entity;
      if (paymentEntity?.order_id) {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: paymentEntity.order_id },
          {
            razorpayPaymentId: paymentEntity.id,
            status: "Paid",
            failureReason: null,
          },
          { new: true },
        );
      }
    } else if (event === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      if (paymentEntity?.order_id) {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: paymentEntity.order_id },
          {
            razorpayPaymentId: paymentEntity.id,
            status: "Failed",
            failureReason: paymentEntity.error_description || "Payment failed",
          },
          { new: true },
        );
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook handling error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "Order id is required" });
    }

    const payment = await Payment.findOne({ razorpayOrderId: orderId }).select(
      "user razorpayOrderId razorpayPaymentId amount currency status createdAt updatedAt",
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (String(payment.user) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Unauthorized status request" });
    }

    return res.json({
      orderId: payment.razorpayOrderId,
      paymentId: payment.razorpayPaymentId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    return res.status(500).json({ message: "Unable to fetch payment status" });
  }
};
