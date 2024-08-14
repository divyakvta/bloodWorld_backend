import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

//Database Connection Configuration

const connectDB = async (): Promise<void> => {
    try {
        console.log(process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Database Connected')
    }catch (error:any) {
        console.error(`Error:${error.message}`);
        process.exit(1);
    }
    
}

export default connectDB;