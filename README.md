
# Gestión de Reservas - Don Mario

Este proyecto  es la entrega Grupal para  la materia DEVOPS

### Integrantes:

- Cynthia Estefanía Choque Galindo 
- Guido Vizzotti 
- Matías Garnica 
- Mauricio Galera 
- Cinthia Romina Vota 


## Estructura del Proyecto

![image](https://github.com/user-attachments/assets/92f4573c-f92a-4f7b-9a81-1ac6a5e31424)


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

---

## Diagrama del pipeline DevOps

![image](https://github.com/user-attachments/assets/cdc76413-a5e3-4166-b706-439c7556b79a)

---

## Conclusiones y roles de equipo

Durante el desarrollo del trabajo integrador se aplicaron las principales prácticas del enfoque DevOps, permitiendo abordar el ciclo de vida completo de una aplicación: desde su desarrollo hasta su despliegue automatizado en un entorno en la nube.

Se logró:
Crear una aplicación funcional utilizando Node.js como backend, integrando una base de datos MongoDB para persistencia.
Gestionar el código fuente utilizando Git, aplicando una estrategia de ramas clara basada en main, develop y ramas feature/*.
Contenerizar la aplicación utilizando Docker, facilitando su portabilidad y ejecución en diferentes entornos.
Crear pruebas automatizadas que se ejecutan como parte de la integración continua para validar el comportamiento de la app.
Configurar un pipeline CI/CD utilizando GitHub Actions, que ejecuta automáticamente los tests, construye la imagen Docker, la publica en GitHub Container Registry y despliega la aplicación en un entorno de pruebas remoto (como Render o similar).

Este enfoque permitió reducir los errores manuales, acelerar los ciclos de entrega y mantener control sobre la calidad del código.
La implementación de DevOps mostró beneficios claros en cuanto a:
Automatización del flujo de trabajo.
Reducción de tiempo para detectar fallos.
Mejora de la trazabilidad de cambios.
Facilidad de despliegue en distintos entornos.

### Roles de equipo

- Cynthia Estefanía Choque Galindo - Desarrollo backend: Programó la lógica del servidor en Node.js, definió rutas, gestionó la conexión a MongoDB y validaciones.
- Guido Vizzotti - Testing y QA: Desarrolló las pruebas automatizadas, verificó endpoints y supervisó la ejecución de tests en el pipeline.
- Matías Garnica - Contenerización: Creó el Dockerfile, docker-compose.yml y configuró el flujo de CI/CD en GitHub Actions.
- Mauricio Galera - Control de versiones y ramas: Gestionó el uso de Git y GitHub, estructuró el uso de ramas (main, develop, feature/*) y resolvió conflictos.
- Cinthia Romina Vota - Documentación y despliegue: Redactó el README.md, diagramó el flujo DevOps, explicó la estructura del proyecto y configuró el despliegue en Render/Vercel.
