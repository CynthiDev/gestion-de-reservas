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
const mongoURI = process.env.MONGODB_URI;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Settings
app.set('port', process.env.PORT || 3000); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}



// Midelwares
app.use(logger('dev'));  // Logger de peticiones
app.use(express.json());  // Parsear JSON en las solicitudes
app.use(express.urlencoded({ extended: true }));  // Para manejar formularios
app.use(cookieParser());  // Manejar cookies


// Routes
app.use(baseAPI+'/', indexRouter);
app.use(baseAPI+'/users', userRouters);
app.use(baseAPI+'/reservations', reservationRoutes);


// Ruta principal
app.get('/main', (req, res) => {
  const token= req.cookies.token;
  if (!token) {
    return res.status(403).send('Acceso no autorizado')
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.render('main', { user: data, token}); 
  } catch (error) {
    return res.status(403).send('Acceso no autorizado 2')
  }
  
});


//Static Files
app.use(express.static(path.join(__dirname, '..', 'public')));



// Manejo de errores
app.use(function(req, res, next) {  // catch 404 and forward to error handler
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




// Server is lisening
app.listen(app.get('port'), () => {
  console.log(`Servidor escuchando en http://localhost:${app.get('port')}`);
});


export default app;