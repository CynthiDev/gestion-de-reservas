import mongoose, { connect } from "mongoose";
import dotenv from 'dotenv';


const mongoAtlasURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const mongoURI = mongoAtlasURI || 'mongodb://localhost:27017/reservasDonMario';


const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Conectado a MongoDB!');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err);
    }
};

export default connectDB;