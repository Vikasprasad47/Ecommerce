import mongoose from "mongoose";
import dotenv from "dotenv";
import SubCategoryModel from "../models/subcategory.model.js"; // ✅ adjust path if needed

dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI');
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // ✅ Sync text index for subcategory
        await SubCategoryModel.syncIndexes(); 
        console.log('✅ SubCategoryModel indexes synced');

    } catch (error) {
        console.error('❌ connectDB error:', error);
        process.exit(1);
    }
}

export default connectDB;
