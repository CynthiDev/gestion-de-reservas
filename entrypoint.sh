#!/bin/sh

echo "Iniciando el servidor de la aplicación en segundo plano..."

# Ejecutar el servidor principal (./bin/www)
node ./bin/www &

# Esperar a que el servidor arranque
sleep 10

echo "Ejecutando el script de seed de la base de datos..."

node ./scripts/seed.js || true # El '|| true' evita que el script falle si el seed ya se corrió


echo "El script de seed ha terminado."

# Mantener el proceso del servidor activo
wait %1 CRLF a L