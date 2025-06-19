import User from "../models/User.js";


export async function crearUsuario(usuarioCreador) {
  const { nombre, apellido, username, rol, contrasenia } = usuarioCreador;

  try {
    const usuarioExistente = await User.findOne({ username });
    if (usuarioExistente) {
      throw new Error(`El nombre de usuario ${username} ya está en uso.`);
    }

    // Crear un nuevo usuario usando el modelo de Mongoose
    const nuevoUsuario = new User(usuarioCreador);
    await nuevoUsuario.save();

    return nuevoUsuario; // Retorna el usuario creado
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
}
