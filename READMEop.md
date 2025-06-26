# Proyecto: Gestión de Reservas - Implementación DevOps

## Descripción del Proyecto

Esta es una aplicación web de gestión de reservas desarrollada con Node.js y Express. El proyecto demuestra un ciclo de vida de desarrollo de software completo aplicando prácticas de DevOps, incluyendo control de versiones con Git, contenerización con Docker, y un pipeline de Integración Continua y Despliegue Continuo (CI/CD) con GitHub Actions para desplegar en la plataforma Render.

## Tecnologías Utilizadas

*   **Backend:** Node.js, Express.js
*   **Base de Datos:** MongoDB Atlas
*   **Contenerización:** Docker, Docker Compose
*   **CI/CD:** GitHub Actions
*   **Plataforma de Despliegue (PaaS):** Render
*   **Testing:** Jest

---

## Cómo Correr el Proyecto Localmente

Para ejecutar la aplicación en tu entorno local usando Docker, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/CynthiDev/gestion-de-reservas.git
    cd gestion-de-reservas
    ```

2.  **Crea tu archivo de variables de entorno:**
    Copia el archivo de ejemplo `.env.example` (si lo tienes) o crea uno nuevo llamado `.env` y añade las siguientes variables:
    ```env
    PORT=3000
    MONGO_USER=mdq
    MONGO_PWD=grupo2
    MONGO_DB=reservasDonMario
    MONGO_HOST=cluster0.wqfaf.mongodb.net
    JWT_SECRET_KEY=mi_clave_secreta
    ```

3.  **Levanta los servicios con Docker Compose:**
    Este comando construirá la imagen de Docker y ejecutará el contenedor.
    ```bash
    docker-compose up --build
    ```

4.  **Accede a la aplicación:**
    La aplicación estará disponible en `http://localhost:3000/api`.

---

## Diagrama del Pipeline DevOps

El pipeline está diseñado para automatizar el proceso desde que un desarrollador sube código hasta que está disponible para los usuarios, asegurando calidad y rapidez.

**Flujo para la rama `develop` (Entorno de Staging):**
1.  **Push a `develop`**: Un desarrollador fusiona una `feature` a la rama `develop`.
2.  **Trigger de GitHub Actions**: El `push` activa el workflow `deploy-develop.yml`.
3.  **Job: Test**:
    *   El código se descarga.
    *   Se instalan las dependencias (`npm ci`).
    *   Se ejecutan las pruebas unitarias y de integración (`npm test`).
4.  **Job: Build & Push**:
    *   Si los tests pasan, se construye una imagen Docker con la etiqueta `:develop`.
    *   La imagen se sube a Docker Hub.
5.  **Job: Deploy**:
    *   Si la imagen se sube correctamente, se envía una señal (webhook) a Render.
    *   Render toma la nueva imagen `:develop` de Docker Hub y redespliega el servicio de `staging`.

**Flujo para la rama `main` (Entorno de Producción):**
*   El proceso es idéntico, pero se activa con un `push` a `main` (generalmente a través de un Pull Request desde `develop`).
*   La imagen Docker se etiqueta como `:latest`.
*   El despliegue se realiza en el servicio de producción en Render.

![Puedes crear un diagrama simple con herramientas como diagrams.net y enlazar la imagen aquí]

---

## Conclusiones y Roles del Equipo

La implementación de este pipeline nos permitió automatizar tareas repetitivas, reducir errores humanos y acelerar el ciclo de entrega. El uso de Docker garantizó la consistencia entre los entornos de desarrollo y producción. El mayor desafío fue configurar correctamente los secretos y permisos entre GitHub, Docker Hub y Render...*