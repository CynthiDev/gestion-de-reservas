# Proyecto: Gestión de Reservas - Implementación DevOps

Este proyecto demuestra un ciclo de vida de desarrollo de software completo, aplicando prácticas de DevOps para llevar una aplicación Node.js desde el desarrollo local hasta el despliegue automatizado en la nube.

## Descripción del Proyecto

La aplicación es un sistema de gestión de reservas para un restaurante, construida con Node.js y Express. El núcleo del proyecto es la implementación de un pipeline de Integración Continua y Despliegue Continuo (CI/CD) que automatiza las pruebas, la contenerización y el despliegue en múltiples entornos (staging y producción) en la plataforma Render.

## Tecnologías Utilizadas

*   **Backend:** Node.js, Express.js, Mongoose
*   **Base de Datos:** MongoDB Atlas
*   **Autenticación:** JSON Web Tokens (JWT) almacenados en cookies seguras (`httpOnly`).
*   **Contenerización:** Docker, Docker Compose
*   **CI/CD:** GitHub Actions
*   **Plataforma de Despliegue (PaaS):** Render
*   **Testing:** Jest, Supertest (para pruebas de API)

---

## 1. Cómo Correr el Proyecto Localmente

Para ejecutar la aplicación en tu entorno local usando Docker:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/CynthiDev/gestion-de-reservas.git
    cd gestion-de-reservas
    ```

2.  **Crea tu archivo de variables de entorno:**
    Crea un archivo llamado `.env` en la raíz del proyecto y añade las siguientes variables. Este archivo es ignorado por Git por seguridad.
    ```env
    # Puerto de la aplicación
    PORT=3000

    # Credenciales de MongoDB Atlas
    MONGO_USER=tu_usuario_mongo
    MONGO_PWD=tu_password_mongo
    MONGO_DB=reservas-dev # Base de datos para desarrollo local
    MONGO_HOST=tu_cluster_host.mongodb.net

    # Secreto para firmar los JWT
    JWT_SECRET_KEY=una_clave_muy_secreta_y_larga
    ```

3.  **Levanta los servicios con Docker Compose:**
    Este comando construirá la imagen de Docker (si no existe), creará el contenedor y lo iniciará.
    ```bash
    docker-compose up --build
    ```

4.  **Accede a la aplicación:**
    Una vez que los logs indiquen que el servidor está escuchando, la aplicación estará disponible en `http://localhost:3000/api`. La primera vez que se ejecute, la base de datos se poblará automáticamente con usuarios de prueba.

---

## 2. Arquitectura y Automatización DevOps

El proyecto implementa un flujo de trabajo DevOps completo, desde el código hasta el despliegue.

### A. Contenerización con Docker

*   **`Dockerfile`:** Utiliza una **compilación multi-etapa** para crear una imagen de producción ligera y segura. Solo se instalan las dependencias de producción, optimizando el tamaño y la superficie de ataque.
*   **`entrypoint.sh`:** Se utiliza un script de `entrypoint` personalizado para orquestar el inicio del contenedor. Este script es responsable de:
    1.  Iniciar el servidor de la aplicación.
    2.  Ejecutar un script de "seeding" para poblar la base de datos (ver más abajo).
    3.  Asegurar que el contenedor se mantenga en ejecución.

### B. Inicialización Automática de la Base de Datos (Seeding)

Para garantizar que los entornos de despliegue sean funcionales desde el primer momento, el proyecto incluye un script de `seed` automático.

*   **Funcionamiento:** Tras un despliegue exitoso, el `entrypoint.sh` ejecuta un script que comprueba si la colección de `users` en la base de datos está vacía.
*   **Población Inteligente:** Si la base de datos está vacía, el script la puebla con un conjunto predefinido de usuarios (clientes y personal), hasheando sus contraseñas. Si la base de datos ya contiene datos, el script no realiza ninguna acción para prevenir la pérdida de datos.
*   **Beneficio:** Este enfoque idempotente asegura que cualquier nuevo despliegue (local, staging o producción) sea **inmediatamente utilizable** sin necesidad de configuración manual, un principio clave de DevOps.

### C. Pipeline de CI/CD con GitHub Actions

El repositorio está configurado con dos workflows de GitHub Actions que se activan según la rama.

![Diagrama del Pipeline DevOps](https://i.imgur.com/tu_diagrama_aqui.png)  
*(imagen real de tu diagrama)*

**Flujo para la rama `develop` (Entorno de Staging):**
1.  **Push a `develop`**: Activa el workflow `deploy-develop.yml`.
2.  **Job: Test**: Se instala Node.js y **todas** las dependencias (incluyendo `devDependencies`) para ejecutar la suite de pruebas con Jest. Esto valida la integridad del código.
3.  **Job: Build & Push**: Si los tests se ejecutan correctamente, se construye una imagen Docker optimizada, basada en la misma configuración utilizada para producción. Esta imagen se etiqueta como :develop y se publica en Docker Hub.
4.  **Job: Deploy**: Se envía una señal (webhook) a Render, que toma la nueva imagen `:develop` y redespliega el servicio de **staging**.

**Flujo para la rama `main` (Entorno de Producción):**
*   El proceso es idéntico y se activa con un `push` a `main`.
*   La imagen Docker se etiqueta como `:latest`.
*   El despliegue se realiza en el servicio de **producción** en Render.
*   Se utilizan diferentes **Variables de Entorno** en Render para que este despliegue se conecte a la base de datos de producción (`reservas-production`).

---

## 3. Conclusiones y Roles del Equipo


La implementación de este pipeline nos permitió automatizar tareas repetitivas, reducir errores humanos y acelerar el ciclo de entrega. El uso de Docker garantizó la consistencia entre los entornos de desarrollo y producción. El mayor desafío fue configurar correctamente los secretos y permisos entre GitHub, Docker Hub y Render, así como diseñar un script de inicio (`entrypoint.sh`) que manejara la inicialización de la base de datos de forma segura y automática.


El proyecto fue desarrollado de manera colaborativa, con cada miembro asumiendo la responsabilidad de un componente crítico del pipeline y las prácticas DevOps:

- 1: Se encargó de la orquestación del CI/CD y la estrategia de branching. Diseñó y escribió los workflows de GitHub Actions (.yml) para los entornos de staging y producción. Además, gestionó la estrategia de Git (ramas develop, main, feature) y configuró los secretos para la comunicación segura entre servicios.
- 2: Lideró la estrategia de contenerización con Docker. Desarrolló el Dockerfile optimizado con una arquitectura multi-etapa para crear imágenes ligeras y seguras. También creó el docker-compose.yml para estandarizar el entorno de desarrollo local para todo el equipo.
- 3: Fue responsable de la automatización de la configuración del entorno y los datos. Desarrolló el script de "seeding" (seed.js) y lo integró con el entrypoint.sh del contenedor. Su trabajo asegura que cualquier entorno, sea local o en la nube, se auto-configure con los datos necesarios al iniciar, eliminando la configuración manual post-despliegue.
- 4: Se enfocó en la integración continua de la calidad (Continuous Quality). Configuró el framework de pruebas con Jest y Supertest y lo integró como un job obligatorio en el pipeline de CI/CD. Su contribución garantiza que ningún código que no pase las pruebas automatizadas pueda avanzar a la etapa de despliegue.
- 5: Gestionó la Infraestructura como Código (IaC) y el despliegue en la nube. Aprovisionó los servicios en Render (staging y producción), manejó las variables de entorno para cada ambiente y se encargó del monitoreo de la salud de la aplicación. También fue responsable de documentar el proceso de despliegue y la arquitectura en el README.md.

---