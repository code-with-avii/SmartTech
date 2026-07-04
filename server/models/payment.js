import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      index: true,
    },
    amount: {
      // Stored in INR major units for readability (e.g., 499.99)
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
      index: true,
    },
    signature: {
      type: String,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        name: String,
        price: Number,
        image: String,
        variant: {
          color: String,
          storage: String,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
