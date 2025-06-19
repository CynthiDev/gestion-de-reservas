
# gestión de Reservas - Don Mario

Este proyecto  es la entrega Grupal para  la materia DEVOPS

### Integrantes:

- Cynthia Estefanía Choque Galindo 
- Guido Vizzotti 
- Matías Garnica 
- Mauricio Galera 
- Cinthia Romina Vota 


## Estructura del Proyecto

La aplicación está organizada en varias carpetas según las responsabilidades del sistema, incluyendo controladores, modelos, rutas, servicios, vistas, utilidades y configuraciones.

### Estructura de Carpetas

```
└── 📁caso3-grupomdq
    └── 📁public
        └── 📁images
        └── 📁javascripts
        └── 📁stylesheets
            └── style.css
    └── 📁src
        └── 📁controllers
            └── reservationController.js
            └── userController.js
        └── 📁core
            └── const.js
            └── enums.js
        └── 📁models
            └── 📁reservation
                └── Reservation.js
                └── reservation.json
            └── 📁user
                └── User.js
                └── user.json
        └── 📁routes
            └── index.js
            └── reservationRoutes.js
            └── userRoutes.js
        └── 📁services
            └── reservationService.js
            └── userService.js
        └── 📁utils
            └── function.js
        └── 📁views
            └── error.pug
            └── index.pug
            └── main.pug
            └── newReservation.pug
            └── reservationConfirmed.pug
            └── reservationList.pug
        └── app.js
    └── .env
    └── .gitignore
    └── nodemon.json
    └── package-lock.json
    └── package.json
    └── README.md
```

### Descripción General

El sistema permite a los usuarios hacer, modificar y gestionar reservas en un restaurante. El personal tiene acceso para gestionar todas las reservas, mientras que los clientes solo pueden ver y gestionar sus propias reservas.

### Entidades

#### 1. **Users**
- **Archivo JSON**: `user.json` contiene los datos de los usuarios, como `nombre`, `apellido`, `username`, `rol` y `contraseña`.
   - **Ubicación**: `src/models/user/user.json`
   - **Modelo**: Definido en `User.js`, que representa la clase `User` con sus atributos y métodos.
   - **Controlador**: `userController.js`, contiene la lógica para gestionar los usuarios (CRUD).
   - **Rutas**: Definidas en `userRoutes.js`.

#### 2. **Reservations**
- **Archivo JSON**: `reservation.json` almacena las reservas.
   - **Ubicación**: `src/models/reservation/reservation.json`
   - **Modelo**: Definido en `Reservation.js`, representa la clase `Reservation`.
   - **Controlador**: `reservationController.js`, contiene la lógica para gestionar las reservas.
   - **Rutas**: Definidas en `reservationRoutes.js`.

### Controladores

Los controladores gestionan la lógica de negocio para las principales funcionalidades:

- **userController.js**: Lógica para crear, listar, actualizar y eliminar usuarios.
- **reservationController.js**: Lógica para crear, listar, actualizar y eliminar reservas.

### Servicios

Los servicios encapsulan la lógica relacionada con la interacción con los modelos y la validación de datos:

- **userService.js**: Servicio para la lógica de los usuarios.
- **reservationService.js**: Servicio para la lógica de las reservas.

### Core

La carpeta **core** contiene constantes y enumeraciones que son utilizadas a lo largo del proyecto para definir valores clave:

- **const.js**: Define las constantes globales del sistema, incluyendo las rutas de archivos JSON como `userJson` y otras configuraciones clave.
   - **Ejemplo**: 
     ```javascript
     export const userJson = '../models/users/users.json';
     export const baseAPI = '/api';
     ```
   
- **enums.js**: Define las enumeraciones (`enums`) utilizadas en todo el sistema, como estados de las reservas (`PENDIENTE`, `CONFIRMADA`, etc.), roles de usuario (`CLIENTE`, `PERSONAL`), y las horas y mesas disponibles para reservas.
   - **Ejemplo**: 
     ```javascript
     export const ReservationState = {
        PENDIENTE: 'Pendiente',
        CONFIRMADA: 'Confirmada',
        CANCELADA: 'Cancelada',
        COMPLETADA: 'Completada'
     };
     ```
   - Utiliza la función `crearFechaUTC` para definir los turnos de las reservas.

### Utils

La carpeta **utils** contiene funciones de utilidad que son utilizadas a lo largo del sistema:

- **function.js**: Define funciones como `leerArchivoJSON`, `escribirArchivoJSON` para manejar archivos JSON, `generarNuevoId` para gestionar IDs correlativos, y `crearFechaUTC` para crear fechas en formato UTC.
   - **Ejemplo**: 
     ```javascript
     export async function leerArchivoJSON(filePath) {
         const data = await fs.readFile(filePath, 'utf-8');
         return JSON.parse(data);
     }
     ```

### Rutas

Las rutas definen los endpoints del sistema y conectan las solicitudes del usuario con los controladores:

- **userRoutes.js**: Define las rutas relacionadas con los usuarios.
- **reservationRoutes.js**: Define las rutas relacionadas con las reservas.
- **index.js**: Punto de entrada principal para las rutas.

### Vistas (Pug)

Las vistas renderizan la interfaz de usuario utilizando el motor de plantillas Pug:

- **index.pug**: Pantalla de login.
- **main.pug**: Pantalla principal después de iniciar sesión.
- **reservationList.pug**: Muestra la lista de reservas.
- **newReservation.pug**: Permite agregar una nueva reserva.
- **reservationConfirmed.pug**: Pantalla de confirmación de reserva.
- **error.pug**: Pantalla de error para manejar excepciones.

### Configuración del Proyecto

1. **Dependencias**: 
   Las dependencias principales están listadas en `package.json`:
   - **Express**: Framework de Node.js para manejar las rutas y la lógica del servidor.
   - **Pug**: Motor de plantillas para renderizar las vistas.
   - **dotenv**: Manejo de variables de entorno.

   Instalar todas las dependencias con:
   ```bash
   npm install
   ```

2. **Scripts**:
   - **Inicio del servidor**:
     ```bash
     npm start
     ```
   - **Desarrollo con nodemon**:
     ```bash
     npm run dev
     ```

### Configuración del Servidor

El servidor está configurado en el archivo `app.js`, utilizando **Express**. Las rutas están conectadas y se renderizan vistas mediante **Pug**. El servidor por defecto corre en el puerto `3000`.

El archivo `nodemon.json` está configurado para monitorear cambios en los archivos dentro de la carpeta `src`.

### Variables de Entorno

El archivo `.env` incluye las variables de entorno que deben ser configuradas para el entorno de desarrollo o producción.

### Cómo Ejecutar el Proyecto

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar el servidor**:
   En modo de desarrollo:
   ```bash
   npm run dev
   ```
   O para producción:
   ```bash
   npm start
   ```

3. **Acceder al proyecto**:
   El servidor estará corriendo en `http://localhost:3000/api`.

### Fuentes:

A continuación, se listan las bibliotecas y herramientas utilizadas en el desarrollo de este proyecto:

1. [Node.js](https://nodejs.org/en/): Entorno de ejecución de JavaScript para el backend.
2. [Express.js](https://expressjs.com/): Framework web minimalista para Node.js.
3. [Pug](https://pugjs.org/api/getting-started.html): Motor de plantillas utilizado para generar vistas HTML.
4. [dotenv](https://www.npmjs.com/package/dotenv): Módulo para cargar variables de entorno desde archivos `.env`.
5. [File System (fs)](https://nodejs.org/api/fs.html): Módulo nativo de Node.js para interactuar con el sistema de archivos.
6. [Nodemon](https://nodemon.io/): Herramienta para reiniciar el servidor automáticamente en modo desarrollo.
7. [Luxon](https://moment.github.io/luxon/): Biblioteca para manipulación de fechas y horas.
8. [JSON](https://www.json.org/json-en.html): Formato de intercambio de datos utilizado para almacenar y transferir información.
9. [Aprende Node.js y Express - Curso desde Cero](https://www.youtube.com/watch?v=1hpc70_OoAg): Fundamentos de Node.js y Express

---