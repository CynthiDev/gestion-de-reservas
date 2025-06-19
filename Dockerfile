FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

WORKDIR /app/src
EXPOSE 3000
CMD ["node", "app.js"]