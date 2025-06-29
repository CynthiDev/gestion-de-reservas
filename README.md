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

| Área                    | Tecnología / Herramienta     | Propósito / Descripción Breve                                                 |
| :---------------------- | :--------------------------- | :---------------------------------------------------------------------------- |
| **Backend**             | `Node.js / Express.js`       | Plataforma y framework para la construcción del servidor y la API.            |
|                         | `Mongoose`                   | ODM (Object Data Modeling) para interactuar con MongoDB de forma estructurada. |
| **Base de Datos**       | `MongoDB Atlas`              | Base de datos NoSQL como servicio (DBaaS) en la nube.                         |
| **Frontend**            | `Pug`                        | Motor de plantillas para el renderizado dinámico de vistas en el servidor.    |
| **Seguridad**           | `JSON Web Tokens (JWT)`      | Para la gestión de sesiones stateless y la autorización.                      |
|                         | `bcrypt`                     | Librería para el hasheo seguro e irreversible de contraseñas.                 |
|                         | `Cookies (httpOnly)`         | Mecanismo para el almacenamiento seguro de tokens en el navegador del cliente.  |
| **Contenerización**     | `Docker`                     | Creación de imágenes portables y consistentes de la aplicación.             |
|                         | `Docker Compose`             | Orquestación del entorno de desarrollo local.                               |
|                         | `Docker Hub`                 | Registro de contenedores para almacenar y distribuir las imágenes.            |
| **CI/CD**               | `GitHub Actions`             | Orquestador del pipeline para la automatización de pruebas y despliegues.   |
|                         | `Git & Git Flow`             | Control de versiones y estrategia de ramificación para el desarrollo.       |
| **Plataforma (PaaS)**   | `Render`                     | Servicio en la nube para el despliegue y alojamiento de la aplicación.      |
| **Testing**             | `Jest`                       | Framework principal para la ejecución de la suite de pruebas.                 |
|                         | `Supertest`                  | Librería para las pruebas de integración de los endpoints de la API.        |
|                         | `mongodb-memory-server`      | Ejecución de tests contra una base de datos en memoria para un aislamiento total. |

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




#### **Lógica del Workflow (Aplicada a ambos entornos)**

Ambos workflows (`develop` y `main`) operan bajo la misma lógica dual para maximizar la seguridad y la eficiencia:

*   **1. Fase de Integración Continua (CI) - Al crear un Pull Request:**
    *   **Disparador:** `on: pull_request`
    *   **Propósito:** Actúa como una **barrera de calidad de dos pasos** antes de que cualquier código sea fusionado a las ramas principales.
    *   **Acciones Requeridas:**
        1.  **Validación Automatizada:** Se ejecuta **únicamente el job de `test`**. El sistema verifica automáticamente que los cambios no rompan la funcionalidad existente.
        2.  **Revisión Humana:** Gracias a las **reglas de protección de ramas** configuradas en GitHub, se requiere la **aprobación explícita de al menos un miembro del equipo**. Este paso asegura la calidad, legibilidad y lógica del código.
    *   **Resultado:** El sistema **impide la fusión del Pull Request** hasta que **ambas condiciones se cumplen**: los tests automáticos pasan y la revisión humana es aprobada. Esto garantiza la máxima calidad y consenso antes de integrar el código.

*   **2. Fase de Despliegue Continuo (CD) - Al fusionar el código (Push):**
    *   **Disparador:** `on: push`
    *   **Propósito:** Desplegar la nueva versión, ya validada, en el entorno correspondiente.
    *   **Acción:** Se ejecuta la **secuencia completa de jobs (`test`, `build-and-push-docker`, `deploy`)**.

---

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
## 3. Evidencia del Pipeline en Ejecución

A continuación, se presentan capturas de pantalla que documentan el funcionamiento del pipeline de CI/CD, desde la validación del código hasta el almacenamiento del artefacto de despliegue.

#### A.Validación de Pull Request (Barrera de Calidad de Dos Pasos)

El pipeline actúa como una robusta barrera de calidad antes de fusionar cualquier cambio a las ramas principales (`develop` y `main`). Este proceso de validación consta de dos pasos obligatorios para garantizar la máxima estabilidad del código:

1.  **Validación Automatizada (CI):** Al crear un Pull Request, el workflow de GitHub Actions ejecuta automáticamente la suite de pruebas. Este es el primer filtro y asegura que los nuevos cambios no rompan la funcionalidad existente.

2.  **Revisión Humana (Code Review):** Además de las pruebas automáticas, se ha configurado una **regla de protección de ramas** en GitHub que exige la aprobación de al menos un miembro del equipo. Este paso es crucial para evaluar la lógica del código, el estilo y el cumplimiento de las buenas prácticas.

El sistema está diseñado para que la fusión solo sea posible cuando **ambas condiciones se cumplen**.

*   **Ejemplo de un PR bloqueado pendiente de revisión:**
    En la siguiente imagen, se puede observar que aunque la **Validación Automatizada pasó** (check verde en "Run Unit & Integration Tests"), el botón de "Merge" está bloqueado porque aún **falta la Revisión Humana**.

    ![Validación-de-PR-con-Tests-Exitosos](https://github.com/user-attachments/assets/d3831e86-a6a1-42d8-99ce-3de00377eb91)


*   **Ejemplo de un PR aprobado y listo para fusionar:**
    Una vez que un miembro del equipo revisa y aprueba los cambios, y los tests automáticos están en verde, el sistema desbloquea la fusión, confirmando que el código cumple con todos los requisitos de calidad.

    ![PR-Aprobado-Listo-para-Fusionar](https://github.com/user-attachments/assets/ac570bcd-7f01-407d-8b42-aba49a67b053)


#### B. Ejecución del Workflow de Despliegue (Despliegue Continuo)

Una vez que el código se fusiona, se activa el pipeline de despliegue completo. Todos los jobs (`test`, `build-and-push-docker`, `deploy`) se ejecutan en secuencia para llevar la aplicación al entorno correspondiente.

*   **Vista de un workflow de despliegue completado exitosamente en GitHub Actions:**

    ![Pipeline-Despliegue-completo](https://github.com/user-attachments/assets/03b0b0da-2744-4663-85e2-f4bf4790e86f)


#### C. Artefactos en Docker Hub

El pipeline construye y publica las imágenes Docker en Docker Hub, etiquetándolas según el entorno (`:develop` para staging, `:latest` para producción). Estas imágenes son los artefactos inmutables que se desplegarán.

*   **Repositorio en Docker Hub con las imágenes publicadas:**

   ![repositorio-docker-hub-actualizado](https://github.com/user-attachments/assets/82ab22ea-0693-42a9-ac39-2860f8b29473)


---

## 4. Entornos Desplegados y Verificación

El resultado final del pipeline es una aplicación funcional y accesible en la nube, con entornos separados para staging y producción.

*   **URL del Entorno de Staging:** `https://gestion-reservas-staging.onrender.com/api`
*   **URL del Entorno de Producción:** `https://gestion-reservas-prod.onrender.com/api`

#### A. Plataforma de Despliegue (Render)

Render gestiona la infraestructura y la ejecución de nuestros contenedores. El dashboard muestra el estado de los servicios y los logs del despliegue, incluyendo la ejecución del script de `entrypoint`.

*   **Dashboard del servicio en Render mostrando un despliegue exitoso ("Live") y logs de inicio:**
  
   ![dashboard-del-servicio-render](https://github.com/user-attachments/assets/d828743c-50db-484c-884c-dd922ee081f8)

    
#### B. Inicialización de la Base de Datos (MongoDB Atlas)

El script de `seeding` automático, ejecutado por el `entrypoint` la primera vez, crea las colecciones y los documentos iniciales en la base de datos correspondiente a cada entorno.

*   **Colección de `users` en MongoDB Atlas después del primer despliegue, mostrando los usuarios creados por el seed:**

       ![Base-de-datos-mongo](https://github.com/user-attachments/assets/0e70169e-f614-4257-8078-db68fb487bb9)


#### C. Aplicación en Funcionamiento

La prueba final es la interacción con la aplicación desplegada. El siguiente ejemplo muestra el acceso a una ruta protegida después de un login exitoso, confirmando que todo el sistema (frontend, backend, base de datos y autenticación) está operando correctamente.

*   **Vista de la aplicación en el navegador, accediendo a la página `/main` en el entorno de producción:**

    ![App-funcionando-en-navegador](https://github.com/user-attachments/assets/96abcd76-e209-4a6a-b286-70df355acfea)



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

| Integrante | Área de Enfoque Principal | Contribuciones Clave |
| :--- | :--- | :--- |
| **Cynthia Estefanía Choque Galindo**| Backend & Orquestación de CI/CD | <ul><li>Programó la lógica central del servidor en Node.js, rutas y controladores.</li><li>Diseñó y escribió los workflows de GitHub Actions (`.yml`) para la automatización completa.</li><li>Lideró la creación y mantenimiento de la documentación técnica (`README.md`).</li></ul> |
| **Mauricio Galera** | Seguridad & Contenerización | <ul><li>Implementó el sistema de autenticación basado en JSON Web Tokens (JWT).</li><li>Desarrolló el `Dockerfile` optimizado (multi-etapa) y el `docker-compose.yml`.</li></ul> |
| **Matías Garnica** | Frontend & Automatización de Entornos | <ul><li>Creó todas las vistas de la aplicación con el motor de plantillas Pug.</li><li>Desarrolló el script de "seeding" (`seed.js`) y el `entrypoint.sh` para la auto-configuración del entorno.</li></ul> |
| **Cinthia Romina Vota** | Calidad & Seguridad de Datos | <ul><li>Implementó el hasheo de contraseñas con `bcrypt` para proteger los datos de usuario.</li><li>Lideró la estrategia de pruebas y la integró como un paso obligatorio en el pipeline de CI.</li></ul> |
| **Guido Vizzotti** | Testing & Infraestructura Cloud | <ul><li>Escribió la suite de pruebas unitarias y de integración con Jest y Supertest.</li><li>Aprovisionó y configuró los servicios (`staging`, `producción`) y las variables de entorno en Render.</li></ul> |
---
