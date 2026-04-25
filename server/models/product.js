import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
            default:null,
        },
        // brand:{
        //     type:String,
        // },
        image:String,
        description:{
            type:String,
            default: "",
        },
        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
        },
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                name: { type: String, required: true },
                rating: { type: Number, required: true },
                comment: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            }
        ],
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
        variants: [
            {
                size: { type: String },
                color: { type: String },
                countInStock: { type: Number, required: true, default: 0 },
            }
        ],
    },
    {timestamps : true}
);
export default mongoose.model("Product", productSchema)
