import mongoose, { connect } from "mongoose";
import dotenv from 'dotenv';

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PWD;
const dbName = process.env.MONGO_DB;
const host = process.env.MONGO_HOST;



const mongoAtlasURI = `mongodb+srv://${user}:${password}@${host}/${dbName}?retryWrites=true&w=majority`;
const mongoURI = mongoAtlasURI || 'mongodb://localhost:27017/reservasDonMario';


const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
        console.log('Conectado a MongoDB!');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err);
        // Salir del proceso con fallo
        process.exit(1);
    }
};

export default connectDB;