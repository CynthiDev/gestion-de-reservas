import mongoose, { connect } from "mongoose";
import dotenv from 'dotenv';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/miBaseDeDatos';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Conectado a MongoDB!');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err);
    }
};

export default connectDB;