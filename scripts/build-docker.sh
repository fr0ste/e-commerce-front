#!/bin/bash

# Script para construir y subir la imagen Docker del frontend
set -e

echo "🔨 Construyendo imagen Docker del frontend..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar que existe el archivo .env
if [ ! -f .env ]; then
    print_warning "Archivo .env no encontrado. Creando desde template..."
    cp env.example .env
    print_warning "Por favor edita el archivo .env con tus valores de producción antes de continuar."
    exit 1
fi

# Cargar variables de entorno
source .env

# Verificar que NEXT_PUBLIC_API_URL esté configurada
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    print_warning "NEXT_PUBLIC_API_URL no está configurada en .env"
    print_warning "Usando valor por defecto: https://ec2-18-118-129-110.us-east-2.compute.amazonaws.com/"
    export NEXT_PUBLIC_API_URL="https://ec2-18-118-129-110.us-east-2.compute.amazonaws.com/"
fi

print_status "Usando API URL: $NEXT_PUBLIC_API_URL"

# Construir la imagen
print_status "Construyendo imagen Docker..."
docker build \
    --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
    -t fr0ste/ecomm-front:latest \
    -t fr0ste/ecomm-front:main \
    .

# Verificar que la construcción fue exitosa
if [ $? -eq 0 ]; then
    print_status "✅ Imagen construida exitosamente"
    
    # Preguntar si quiere subir la imagen
    read -p "¿Quieres subir la imagen a Docker Hub? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Subiendo imagen a Docker Hub..."
        docker push fr0ste/ecomm-front:latest
        docker push fr0ste/ecomm-front:main
        print_status "✅ Imagen subida exitosamente a Docker Hub"
    fi
else
    print_warning "❌ Error al construir la imagen"
    exit 1
fi

print_status "🎉 Proceso completado!"
print_status "Imagen disponible como: fr0ste/ecomm-front:latest" 