import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            index: true,
        },
        type:{
            type:String,
            required:true,
            enum:["Mobile","Laptop","Tablet","Watch","Audio","Accessories","Drone","Camera"],
            default:"Mobile",
        },
        price:{
            type:Number,
            required:true,
            default:null,
            index: true,
        },
        brand:{
            type:String,
            index: true,
        },
        image:String,
        description:{
            type:String,
            default: "",
        },
        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
            index: true,
        },
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                name: { type: String, required: true },
                rating: { type: Number, required: true },
                comment: { type: String, required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        rating: { 
            type: Number, 
            required: true, 
            default: 0,
            index: true,
            },
        numReviews: { 
            type: Number,
            required: true, 
            default: 0,
            index: true,
        },
        variants: [
            {
                size: { type: String },
                color: { type: String },
                countInStock: { type: Number, required: true, default: 0,
                index: true,
                },
            }
        ],
    },
    {timestamps : true}
);
export default mongoose.model("Product", productSchema)
