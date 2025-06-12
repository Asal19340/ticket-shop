import {connect} from 'mongoose';
import { config } from 'dotenv';
config();

export const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('Error connecting to the database:', error);
        
    }
}

export default connectDB;