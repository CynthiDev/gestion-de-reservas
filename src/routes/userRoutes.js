import express from "express";
import * as userController from '../controllers/userController.js';
const routerUser = express.Router();



routerUser.post('/', userController.crearUsuario);

// Ruta para login (Obtener usuario según credenciales)
routerUser.post('/login', userController.loginUser);

// Ruta para logout (Eliminar usuario de la sesión)
routerUser.post('/logout', userController.logoutUser);

// Obtener todos los usuarios
routerUser.get('/', userController.getAllUsers);

// Eliminar un usuario por ID
routerUser.delete('/:id', userController.deleteUserById);

export default routerUser;
