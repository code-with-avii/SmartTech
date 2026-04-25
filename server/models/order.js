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
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
