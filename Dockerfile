# ---- Etapa 1: Builder ----
# Usamos una imagen completa de Node para instalar dependencias y construir
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json para cachear las dependencias
COPY package*.json ./

# Instalamos las dependencias de producción. 'npm ci' es más rápido y seguro para CI/CD.
RUN npm ci --only=production

# Copiamos el resto del código fuente de la aplicación
COPY . .

# ---- Etapa 2: Final ----
# Usamos una imagen más ligera para la ejecución
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiamos las dependencias instaladas y el código desde la etapa 'builder'
COPY --from=builder /usr/src/app .

# 1. Copiamos el script de entrypoint a la imagen
COPY entrypoint.sh .
# 2. Le damos permisos de ejecución al script
RUN chmod +x ./entrypoint.sh

# Exponemos el puerto en el que corre la aplicación 
EXPOSE 3000

# 3. Usamos  el punto de entrada del contenedor
ENTRYPOINT ["./entrypoint.sh"]
