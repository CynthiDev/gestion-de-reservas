import * as userService from "../services/userService.js";
import User from '../models/User.js';
import bcrypt from 'bcrypt'; // Importa bcrypt
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";

// Login de usuario
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca al usuario por nombre de usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("Usuario incorrecto");
    }

    // Compara la contraseña proporcionada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Contraseña incorrecta");
    }

    const payload = {
      userId: user._id,
      username: user.username,
      nombre: user.nombre
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,  // Impide que el token sea accesible desde JavaScript
      secure: process.env.NODE_ENV === 'production',  // Solo en HTTPS en producción
      maxAge: 3600000 // 1 hora de expiración
    })
    
    res.redirect('/main')

    // res.send({ user, token }); 
  } catch (error) {
    console.error("Error al autenticar el usuario:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Logout de usuario
export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.render("index");
};

// Crear un nuevo usuario
export async function crearUsuario(req, res) {
  try {
    // Extraer los datos del usuario desde el cuerpo de la solicitud
    const { nombre, apellido, username, rol, password } = req.body;

    // Encriptar la contraseña con bcrypt
    const salt = await bcrypt.genSalt(10); // Genera un "salt" para agregar aleatoriedad
    const hashedPassword = await bcrypt.hash(password, salt); // Genera el hash

    // Crear un nuevo objeto con la contraseña encriptada
    const nuevoUsuario = {
      nombre,
      apellido,
      username,
      rol,
      password: hashedPassword, // Almacena la contraseña encriptada
    };

    // Llama al servicio para guardar el usuario
    const usuarioCreado = await userService.crearUsuario(nuevoUsuario);

    return res.status(201).json(usuarioCreado);
  } catch (error) {
    console.error("Error en el controlador:", error);
    if (error.isClientError) {
      return res
        .status(error.statusCode || 400)
        .json({ message: error.message });
    }
    //return res.status(500).json({ message: MSG_ERROR_500 });
    return res.status(500).json({ message: error.message });
  }
}

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Recupera todos los usuarios
    res.status(200).json(users); // Devuelve los usuarios como JSON
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

// Eliminar un usuario por ID
export const deleteUserById = async (req, res) => {
  const { id } = req.params; // Obtiene el ID desde los parámetros de la ruta

  try {
    const user = await User.findByIdAndDelete(id); // Busca y elimina el usuario por ID
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: `Usuario con ID ${id} eliminado` });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};