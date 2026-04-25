import mongoose from "mongoose";

const connectDB= async() =>{
    try{
     await mongoose.connect(process.env.MONGOURI)
     console.log("Mongodb connected")
    }
    catch(err){
        console.error(err);
    };
}

export default connectDB;
