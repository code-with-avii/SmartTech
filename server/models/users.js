
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        Unique:true,
    },
    password:{
        type:String,
        require:[true,"Password is required"]
    },
     isVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:{
        type:String
    },
    verificationTokenExpires:{
        type:Date
    },
    resetpasswordToken:String,
    resetpasswordExpires:Date,
    profilePic: String,
    gender: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: "",
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^\+?[\d\s-]{10,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pincode: {
        type: String,
        default: "",
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^\d{5,6}$/.test(v);
            },
            message: props => `${props.value} is not a valid pincode!`
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    refreshToken: {
        type: String,
    },
    addresses: [
      {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      }
    ]
},
{timestamps:true})

export default mongoose.model("User",userSchema);