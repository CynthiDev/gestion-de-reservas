set -e

echo "Iniciando el servidor de la aplicación en segundo plano..."
# 1. Inicia la aplicación y guarda su Process ID (PID)
node ./bin/www &
APP_PID=$! # <-- Guarda el PID del último proceso en segundo plano

echo "Esperando 10 segundos para que el servidor se estabilice..."
sleep 10

echo "Ejecutando el script de seed de la base de datos..."
# 2. Ejecuta el seed. La opción --force es por si se queda colgado.
node ./scripts/seed.js || true # El '|| true' evita que el script falle si el seed ya se corrió

echo "El script de seed ha terminado."

# 3. Espera a que el proceso de la aplicación termine.
echo "Manteniendo el servidor en ejecución (PID: $APP_PID)..."
wait $APP_PID