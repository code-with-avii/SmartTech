import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        name: String,
        image: String,
        price: Number,
        variant: {
          color: String,
          storage: String,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
        type: Number,
        default: 0,
    },

    shippingCharge: {
        type: Number,
        default: 0,
    },

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
    paymentMethod: {
        type: String,
        enum: ["Razorpay", "COD"],
        default: "Razorpay"
    },
     isPaid: {
        type: Boolean,
        default: false,
    },
     paidAt: Date,

    deliveredAt: Date,

    razorpayOrderId: {
      type: String,
      default: null,
    },
     razorpayPaymentId: String,

    razorpaySignature: String,

    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
    }

  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
