import mongoose from 'mongoose';
import { ReservationMesa, ReservationState } from '../core/enums.js';
import { Schema } from 'mongoose';
import User from './User.js';



const reservationSchema = new Schema({
    numMesa: {
        type: Number,
        required: true,
        enum: Object.values(ReservationMesa) 
    },
    fechaDeTurno: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        required: true,
        default: ReservationState.PENDIENTE, 
        enum: Object.values(ReservationState) 
    },
    nombreCliente: {
        type: String,
        required: true
    },
    comentario: {
        type: String,
        required: false 
    },
    // Referencia al usuario creador
usernameUsuarioCreador: {
    type: String,
    required: true,
    validate: {
      validator: async function (v) {
        // Validación para verificar si el username existe en la base de datos
        const user = await User.findOne({ username: v });
        return user !== null;  // Devuelve true si el usuario existe
      },
      message: (props) => `El usuario con username ${props.value} no existe en la base de datos.`,
    }
    }
}, { timestamps: true }); // campos createdAt y updatedAt

// Crear el modelo
const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;