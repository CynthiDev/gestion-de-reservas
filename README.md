# Proyecto: Gestión de Reservas - Implementación DevOps

Este proyecto demuestra un ciclo de vida de desarrollo de software completo, aplicando prácticas de DevOps para llevar una aplicación Node.js desde el desarrollo local hasta el despliegue automatizado en la nube.

### Integrantes:

- Cynthia Estefanía Choque Galindo 
- Guido Vizzotti 
- Matías Garnica 
- Mauricio Galera 
- Cinthia Romina Vota 

## Descripción del Proyecto

La aplicación es un sistema de gestión de reservas para un restaurante, construida con Node.js y Express. El núcleo del proyecto es la implementación de un pipeline de Integración Continua y Despliegue Continuo (CI/CD) que automatiza las pruebas, la contenerización y el despliegue en múltiples entornos (staging y producción) en la plataforma Render.

## Tecnologías Utilizadas

*   **Backend:** Node.js, Express.js (Framework), Mongoose (ODM para MongoDB).
*   **Base de Datos:** MongoDB Atlas (Base de datos NoSQL en la nube).
*   **Frontend:** Pug (Motor de plantillas para renderizado en el servidor).
*   **Seguridad y Autenticación:**
    *   **JSON Web Tokens (JWT):** Para la gestión de sesiones stateless.
    *   **bcrypt:** Para el hasheo seguro e irreversible de contraseñas.
    *   **Cookies httpOnly:** Para el almacenamiento seguro de tokens en el cliente.
*   **Contenerización y Registros:**
    *   **Docker:** Para la creación de imágenes portables y consistentes.
    *   **Docker Compose:** Para la orquestación del entorno de desarrollo local.
    *   **Docker Hub:** Como registro para almacenar las imágenes de la aplicación.
*   **CI/CD y Automatización:**
    *   **GitHub Actions:** Como orquestador del pipeline de integración y despliegue continuo.
    *   **Git & Git Flow:** Para el control de versiones y la estrategia de ramificación.
*   **Plataforma de Despliegue (PaaS):** Render.
*   **Testing Automatizado:**
    *   **Jest:** Como framework principal para las pruebas.
    *   **Supertest:** Para las pruebas de integración de los endpoints de la API.
    *   **mongodb-memory-server:** Para ejecutar pruebas contra una base de datos en memoria, aislando los tests del entorno de desarrollo.

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
    MONGO_DB=reservas-develop # Nombre de la base de datos para desarrollo local
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

El proyecto implementa un flujo de trabajo DevOps completo, donde la automatización y las buenas prácticas garantizan un ciclo de vida del software robusto, seguro y eficiente.

### A. Estrategia de Ramas y Flujo de Trabajo (Git Flow)

Se utiliza un modelo de Git Flow para gestionar el código, asegurando que la rama `main` siempre contenga código estable y listo para producción.

1.  **Ramas de Feature (`feature/*`):** Todo nuevo desarrollo se realiza en una rama de feature, creada a partir de `develop`.
2.  **Integración en `develop`:** Una vez completada, la feature se propone para su integración en `develop` a través de un **Pull Request**.
3.  **Promoción a `main`:** Después de que `develop` ha sido probado en el entorno de Staging, se abre un **Pull Request** de `develop` a `main` para el despliegue en producción.



### B. Contenerización con Docker

*   **`Dockerfile`:** Utiliza una **compilación multi-etapa** para crear una imagen de producción ligera y segura. Solo se instalan las dependencias de producción, optimizando el tamaño final y la superficie de ataque.
*   **`entrypoint.sh`:** Se utiliza un script de `entrypoint` personalizado para orquestar el inicio del contenedor. Este script es responsable de:
    1.  Iniciar el servidor de la aplicación en segundo plano.
    2.  Ejecutar un script de "seeding" para poblar la base de datos de forma segura.
    3.  Asegurar que el contenedor se mantenga en ejecución, esperando a que el proceso principal de la aplicación termine.




### C. Inicialización Automática de la Base de Datos (Seeding)

Para garantizar que los entornos de despliegue sean funcionales desde el primer momento, el proyecto incluye un script de `seed` automático.

*   **Funcionamiento:** Tras un despliegue exitoso, el `entrypoint.sh` ejecuta un script que comprueba si la colección de `users` en la base de datos está vacía.
*   **Población Inteligente:** Si la base de datos está vacía, el script la puebla con un conjunto predefinido de usuarios. Si la base de datos ya contiene datos, el script no realiza ninguna acción.
*   **Beneficio:** Este enfoque idempotente asegura que cualquier nuevo despliegue (local, staging o producción) sea **inmediatamente utilizable** sin necesidad de configuración manual, un principio clave de DevOps.



### D. Pipeline de CI/CD con GitHub Actions

El pipeline de CI/CD es el núcleo de la automatización y está diseñado para actuar de forma inteligente según el contexto (Pull Request o Push), utilizando dos archivos de workflow: `deploy-develop.yml` y `deploy-main.yml`.

![Diagrama del Pipeline CI/CD](https://i.imgur.com/tu_diagrama_aqui.png)  
*( imagen del diagrama)*

#### **Lógica del Workflow (Aplicada a ambos entornos)**

Ambos workflows (`develop` y `main`) operan bajo la misma lógica dual para maximizar la seguridad y la eficiencia:

*   **1. Fase de Integración Continua (CI) - Al crear un Pull Request:**
    *   **Disparador:** `on: pull_request`
    *   **Propósito:** Actúa como una **barrera de calidad** antes de que cualquier código sea fusionado a las ramas principales.
    *   **Acción:** Se ejecuta **únicamente el job de `test`**. No se construye ninguna imagen ni se despliega nada.
    *   **Resultado:** El Pull Request en GitHub muestra un "check" verde si las pruebas pasan, dando confianza al equipo para aprobar la fusión.

*   **2. Fase de Despliegue Continuo (CD) - Al fusionar el código (Push):**
    *   **Disparador:** `on: push`
    *   **Propósito:** Desplegar la nueva versión verificada de la aplicación en el entorno correspondiente.
    *   **Acción:** Se ejecuta la **secuencia completa de jobs (`test`, `build-and-push-docker`, `deploy`)**.


#### **Implementación por Entorno**

*   **Para `develop` (Staging):**
    *   El workflow `deploy-develop.yml` se encarga del proceso.
    *   En la fase de CD, la imagen Docker se etiqueta como `:develop` y se despliega en el servicio de **staging** en Render. Este servicio utiliza sus propias variables de entorno para conectarse a la base de datos de staging (`reservas-staging`).

*   **Para `main` (Producción):**
    *   El workflow `deploy-main.yml` gestiona el despliegue a producción.
    *   En la fase de CD, la imagen Docker se etiqueta como `:latest` y se despliega en el servicio de **producción** en Render, que utiliza sus propias variables de entorno para conectarse a la base de datos de producción (`reservas-production`).


![workflow-staging](https://github.com/user-attachments/assets/582d529d-04c3-4fce-8900-fa6985384033)

![workflow-prod](https://github.com/user-attachments/assets/da83f6ab-8a6a-4925-ad3f-96ffcfc08024)

---
## 3. Evidencia de Ejecución

- Captura del Pull Request Exitoso (con el check verde):
  * Qué mostrar: La página de un Pull Request (por ejemplo, de develop a main) después de que los tests han pasado. Debe verse claramente el "check" verde y el mensaje "All checks have passed".
  * Por qué es importante: Demuestra que tu fase de Integración Continua (CI) funciona como una barrera de calidad.
  *  ![Validación de PR con Tests Exitosos](URL_de_la_imagen.png)

- Captura del Workflow de Despliegue en GitHub Actions:
  * Qué mostrar: La vista detallada de una ejecución del workflow (por ejemplo, deploy-main.yml) en la pestaña "Actions" de GitHub. Deben verse todos los jobs (test, build-and-push-docker, deploy) con un "check" verde.
  * Por qué es importante: Es la prueba de que todo el flujo de Despliegue Continuo (CD) se completó exitosamente.
  * Texto para el README: ![Ejecución Exitosa del Pipeline de Despliegue](URL_de_la_imagen.png)

- Captura del dcokerHub, imagenes pusheadas

---
## 4. Entornos Desplegados

- Captura del Servicio en Render:
   * Staging: https://gestion-reservas-staging.onrender.com/api/
   * Prduction: https://gestion-reservas-prod.onrender.com/api/
   * Qué mostrar: El dashboard de uno de tus servicios en Render (staging o producción). Debe verse el nombre del servicio, la URL de .onrender.com, y el estado "Live" o "Deploy successful". LOGs de inicio de la app
   * Por qué es importante: Es la evidencia final de que el despliegue funcionó y la aplicación está en línea.
- Captura de la Aplicación Funcionando:
   * Qué mostrar: Una captura de pantalla de tu aplicación corriendo en el navegador, accediendo a la URL de Render (por ejemplo, la página /main después de hacer login).
   * Por qué es importante: Demuestra que el producto final es funcional y accesible para el usuario.
- Captura de la base de datos creada (mongo)


---

## 5. Conclusiones y Roles del Equipo

### A. Conclusiones

La implementación exitosa de este proyecto demostró la aplicación práctica y el valor de los principios DevOps, logrando construir un ciclo de vida de software completo, desde el código fuente hasta un sistema de entrega continua en la nube.

El núcleo del proyecto fue la creación de un **pipeline de CI/CD robusto con GitHub Actions**, que actúa como el espinazo de la automatización. Al integrar una estrategia de ramas (`develop`, `main`) con validaciones automáticas en los Pull Requests, se estableció una barrera de calidad que **garantiza la integridad del código antes de cada fusión**. Esto, combinado con una suite de **pruebas automatizadas**, permitió reducir drásticamente el tiempo de detección de fallos y mejorar la trazabilidad de cada cambio.

La **contenerización con Docker fue fundamental para garantizar la consistencia y portabilidad** de la aplicación. El uso de un `Dockerfile` multi-etapa resultó en imágenes optimizadas y seguras. El mayor desafío técnico y, a su vez, uno de los logros más significativos, fue el diseño de un **script `entrypoint.sh` personalizado**. Este script no solo inicia la aplicación, sino que orquesta la **inicialización automática y segura de la base de datos (seeding)**, asegurando que cualquier entorno desplegado sea funcional desde el primer segundo, sin intervención manual.

En resumen, la adopción de estas prácticas DevOps trajo beneficios tangibles e inmediatos:
*   **Automatización Completa:** Desde las pruebas hasta el despliegue, eliminando errores manuales.
*   **Velocidad y Agilidad:** Ciclos de entrega más rápidos y seguros.
*   **Consistencia y Fiabilidad:** Entornos predecibles gracias a Docker y la configuración centralizada.
*   **Calidad Incorporada:** Las pruebas como parte integral del pipeline aseguran que solo el código de alta calidad llegue a producción.

En conclusión, este trabajo no solo entregó una aplicación funcional, sino que construyó un sistema de entrega de software moderno, resiliente y altamente automatizado, validando la eficacia del enfoque DevOps en proyectos del mundo real.




### B. Roles del equipo

El proyecto fue desarrollado de manera colaborativa, donde cada miembro aportó tanto al desarrollo de la aplicación como a la implementación de la infraestructura DevOps. Las responsabilidades se distribuyeron de la siguiente manera:

*   **Cynthia Estefanía Choque Galindo:**
    *   **Desarrollo del Backend:** Programó la lógica central del servidor en Node.js, incluyendo la definición de rutas, la gestión de controladores y la conexión con la base de datos MongoDB.
    *   **Orquestación de CI/CD:** Diseñó y escribió los workflows de GitHub Actions (`.yml`) que automatizan el ciclo completo de pruebas y despliegues para los entornos de `staging` y `producción`.
    *   **Documentación:** Lideró la creación de la documentación técnica del proyecto (`README.md`).

*   **Mauricio Galera:**
    *   **Autenticación y Seguridad:** Implementó el sistema de autenticación basado en JSON Web Tokens (JWT), incluyendo la generación de tokens en el login y su validación mediante cookies seguras.
    *   **Estrategia de Contenerización:** Desarrolló el `Dockerfile` optimizado con una arquitectura multi-etapa para crear imágenes ligeras y seguras, y creó el `docker-compose.yml` para estandarizar el entorno de desarrollo local.

*   **Matías Garnica:**
    *   **Desarrollo del Frontend y UI/UX:** Creó todas las vistas de la aplicación utilizando el motor de plantillas Pug y gestionó la interacción dinámica entre el frontend y el backend para asegurar una experiencia de usuario fluida.
    *   **Automatización del Entorno:** Desarrolló el script de "seeding" (`seed.js`) y lo integró con el `entrypoint.sh` del contenedor, una contribución clave que permite que cualquier entorno se auto-configure con datos iniciales al arrancar.

*   **Cinthia Romina Vota:**
    *   **Seguridad de Datos de Usuario:** Implementó una de las características de seguridad más críticas: el hasheo de contraseñas utilizando `bcrypt`. Su trabajo asegura que las credenciales de los usuarios se almacenen de forma segura e irreversible en la base de datos.
    *   **Integración Continua de la Calidad:** Lideró la estrategia de pruebas automatizadas. Configuró el framework de testing con Jest y Supertest y lo integró como un paso obligatorio en el pipeline de CI/CD, garantizando que el código nuevo sea validado antes de cualquier despliegue.

*   **Guido Vizzotti:**
    *   **Desarrollo de Pruebas Automatizadas:** Escribió las pruebas unitarias y de integración que verifican la correcta funcionalidad de los endpoints de la API y los métodos clave del sistema.
    *   **Gestión de la Infraestructura en la Nube:** Aprovisionó y configuró los servicios de `staging` y `producción` en Render, gestionó las variables de entorno para cada ambiente y se encargó del monitoreo post-despliegue de las aplicaciones.

---
