import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config'; 
import User from '../src/models/User.js'; 

const usersToSeed = [
  {
    nombre: "Juan",
    apellido: "Pérez",
    username: "juan.perez@example.com",
    rol: "Cliente",
    password: "juanperez"
  },
  {
    nombre: "Ana",
    apellido: "García",
    username: "ana.garcia@example.com",
    rol: "Cliente",
    password: "anagarcia"
  },
  {
    nombre: "Carlos",
    apellido: "Rodríguez",
    username: "carlos.rodriguez@example.com",
    rol: "Personal",
    password: "carlosrodriguez"
  },    
  {
    nombre: "María",
    apellido: "López",
    username: "maria.lopez@example.com",
    rol: "Personal",
    password: "marialopez"
  }
];

const seedDatabase = async () => {
  try {
    //Conexion DDBB
    const { MONGO_USER, MONGO_PWD, MONGO_HOST, MONGO_DB } = process.env;
    const dbUri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`;
    
    await mongoose.connect(dbUri);
    console.log(`Conectado a la base de datos: ${MONGO_DB}`);

    // Borrar user existentes
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('La base de datos ya tiene usuarios. No se ejecutará el seed.');
      // Cerramos la conexión y salimos del script sin hacer nada más.
      await mongoose.connection.close();
      return; 
    }


    console.log('La base de datos está vacía. Iniciando el proceso de seed...');


    //Hashear Contraseñas
    const salt = await bcrypt.genSalt(10);
   const usersWithHashedPasswords = await Promise.all(
      usersToSeed.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    await User.insertMany(usersWithHashedPasswords);
    console.log(`${usersWithHashedPasswords.length} usuarios han sido creados exitosamente.`);

  } catch (error) {
    console.error('Error durante el seeding de la base de datos:', error);
  } finally {
    // Cerrar conexion
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Conexión a la base de datos cerrada.');
    }
  }
};

seedDatabase();
