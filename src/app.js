//utilizando módulos ES (ECMAScript Modules)
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import userRouters from './routes/userRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import { fileURLToPath } from 'url';
import { baseAPI } from './core/const.js';
import 'dotenv/config';  //reconoce variables de entorno
import connectDB from './config/database.js';
import jwt from 'jsonwebtoken';





// Initializations
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Conectar a la base de datos (excepto en entorno de test)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}



// Settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// Midelwares(No cambiar de orden)
app.use(logger('dev'));  // Logger de peticiones
app.use(express.json());  // Parsear JSON en las solicitudes
app.use(express.urlencoded({ extended: true }));  // Para manejar formularios
app.use(cookieParser());  // Manejar cookies
app.use(express.static(path.join(__dirname, '..', 'public')));  //Static Files





// Autenticación
function isAuthenticated(req, res, next) { // Middleware "guardián" que ahora verifica un JWT
  const token = req.cookies.token; 

  if (!token) {
    return res.status(403).redirect(baseAPI + '/users/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; 
    next(); // El token es válido, puede continuar.
  } catch (error) {
    return res.status(403).send('Token inválido o expirado. Acceso no autorizado.');
  }
}



// Routes
app.use(baseAPI + '/', indexRouter);
app.use(baseAPI + '/users', userRouters); 
app.use(baseAPI + '/reservations', isAuthenticated, reservationRoutes);
app.get('/main', isAuthenticated, (req, res) => { // La ruta principal ahora usa nuestro nuevo guardián
  res.render('main', { user: req.user });  
});



// Manejo de errores
app.use(function(req, res, next) {  // catch 404 and forward to error handler
  next(createError(404, 'La página que buscas no existe.'));
});

// Manejador de errores general.
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});



export default app;