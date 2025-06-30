# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Etapa final
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

# Copiar entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Variables de entorno necesarias (ej: timezone, si usás)
ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]