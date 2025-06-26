import { UserRol } from "../core/enums.js";
import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  rol: {
    type: String,
    required: true,
    enum: Object.values(UserRol),
  },
  password: {
    type: String,
    required: true,
  },
});

// Crear el modelo
const User = mongoose.model('User', userSchema);
export default User;
