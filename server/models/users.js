
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
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
},
{timestamps:true})

export default mongoose.model("User",userSchema);