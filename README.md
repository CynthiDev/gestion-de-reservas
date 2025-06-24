
# Gestión de Reservas - Don Mario

Este proyecto  es la entrega Grupal para  la materia DEVOPS

### Integrantes:

- Cynthia Estefanía Choque Galindo 
- Guido Vizzotti 
- Matías Garnica 
- Mauricio Galera 
- Cinthia Romina Vota 


## Estructura del Proyecto

![image](https://github.com/user-attachments/assets/2a1bedca-c5bc-40a4-8b68-c4398fdc94fd)


## Despliegue en Render

La aplicación está desplegada en [Render](https://render.com), utilizando integración directa con GitHub con **Docker**. El entorno cuenta con despliegue automático y manual según la rama `develop` (para pruebas) y `main` (para producción, si se configura).

### Configuración de despliegue

- **Repositorio conectado:** `https://github.com/CynthiDev/gestion-de-reservas`
- **Rama de despliegue:** `main`
- **Tipo de instancia:** Gratuita (`Free`, 512MB RAM, 0.1 CPU)
- **Comando de build:**  
  ```bash
  npm install
  ```
- **Comando de inicio:**  
  ```bash
  npm start
  ```
- **Despliegue automático:** Habilitado para cada push a la rama configurada (`develop`)
- **Entorno:** Node.js
- **Dockerfile:** `Dockerfile` define cómo se construye la imagen de la aplicación.

### Flujo de despliegue

- Render se conecta al repositorio de GitHub y está configurado para observar las ramas develop y main.

- Cuando se realiza un push a cualquiera de estas ramas, Render construye y despliega automáticamente el servicio.

- La aplicación utiliza Docker para definir su entorno de ejecución, permitiendo un control completo sobre las dependencias y procesos.

### Variables de entorno configuradas

Estas variables se definen desde la sección **Environment** en Render:

| Clave             | Descripción                                |
|------------------|---------------------------------------------|
| `JWT_SECRET_KEY` | Clave secreta para generación de JWT        |
| `MONGO_USER`     | Usuario de MongoDB                          |
| `MONGO_PWD`      | Contraseña de MongoDB                       |
| `MONGO_DB`       | Nombre de la base de datos (`reservasDonMario`) |
| `MONGO_HOST`     | Host del cluster de MongoDB Atlas           |

La conexión a la base de datos se arma desde estas variables mediante una cadena de conexión construida dinámicamente en la aplicación:

```javascript
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`;
```

> Estas variables se cargan desde el panel de configuración de Render y no deben subirse al repositorio.

### Eventos de despliegue

Desde la pestaña **Events**, se puede verificar el historial de despliegues y ver qué cambios se publicaron. Cada despliegue detalla si fue activado automáticamente o manualmente desde el panel, y el commit correspondiente.

### Logs en tiempo real

Desde la pestaña **Logs** se puede:

- Ver el resultado de los comandos `npm install` y `npm start`
- Ver errores en tiempo real, incluyendo:
  - Conexiones exitosas a MongoDB
  - Errores de rutas o controladores
  - Respuestas a peticiones `GET`, `POST`, etc.


## CI/CD

El proyecto se despliega automáticamente en [Render](https://render.com) usando **Docker**.

### Archivos y configuración relevante:

- `Dockerfile`: define cómo se construye la imagen de la aplicación.

### Flujo de despliegue:

- Render se conecta al repositorio de GitHub para **escuchar los cambios en las ramas `main` y `develop`**, construyendo la imagen Docker y desplegando automáticamente.
- Al detectar un nuevo push, Render **construye y ejecuta** el contenedor usando la imagen definida.
- Las variables de entorno se cargan desde el panel de configuración de Render (`Environment > Environment Variables`).

### Logs y monitoreo:

- Los eventos de build y despliegue pueden visualizarse en la pestaña **Events**.
- Los logs de ejecución del contenedor se muestran en la pestaña **Logs**.

---

## Integración Continua (CI)

Este proyecto cuenta con una configuración de **GitHub Actions** que corre automáticamente en cada push o pull request a las ramas `develop` y `main`.

### Tareas automatizadas:

- Instalación de dependencias (`npm install`)
- Ejecución de tests con cobertura

El archivo de configuración se encuentra en:

```
.github/workflows/ci.yml
```

### Flujo CI/CD

- GitHub Actions ejecuta los tests al hacer push o PR hacia `develop` o `main`.
- Si los tests son exitosos y el cambio se mergea, **Render toma automáticamente la última imagen y la despliega** usando Docker.
- El entorno de despliegue se define mediante un contenedor Docker.

> Con esta configuración, se garantiza que no se despliega código roto o sin testear.
