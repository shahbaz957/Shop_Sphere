import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database is connected Successfully !!!")
    } catch (error) {
        console.log("Mongo DB connection Error occured : " , error)
    }
}

export default connectDB;