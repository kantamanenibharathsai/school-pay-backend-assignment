import dotenv from "dotenv";
dotenv.config({ path: '../config.env' });
import mongoose from 'mongoose';

export async function connectDB() {
    try {
        const mongoURI = process.env.CONN_STR;
        if (!mongoURI) throw new Error('CONN_STR not set in environment');
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}