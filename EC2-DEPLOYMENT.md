# Guía de Deployment en EC2 - E-commerce Frontend

Esta guía te ayudará a desplegar el frontend de la aplicación e-commerce en una instancia EC2 de AWS usando Docker Hub.

## 📋 Prerrequisitos

- Una instancia EC2 con Ubuntu Server 20.04 o superior
- Acceso SSH a la instancia EC2
- Backend desplegado en una instancia separada
- Imágenes de Docker subidas a Docker Hub

## 🚀 Pasos para el Deployment

### 1. Preparar la Instancia EC2

#### 1.1 Conectarse a la instancia EC2
```bash
ssh -i tu-key.pem ubuntu@tu-ec2-public-ip
```

#### 1.2 Ejecutar el script de setup
```bash
# Descargar el script de setup
curl -O https://raw.githubusercontent.com/tu-usuario/tu-repo/main/setup-ec2.sh
chmod +x setup-ec2.sh
./setup-ec2.sh
```

**O si ya tienes los archivos en la instancia:**
```bash
chmod +x setup-ec2.sh
./setup-ec2.sh
```

#### 1.3 Reiniciar la sesión SSH
```bash
exit
ssh -i tu-key.pem ubuntu@tu-ec2-public-ip
```

### 2. Preparar los Archivos de la Aplicación

#### 2.1 Crear el directorio de la aplicación
```bash
sudo mkdir -p /opt/ecommerce
sudo chown ubuntu:ubuntu /opt/ecommerce
cd /opt/ecommerce
```

#### 2.2 Copiar los archivos necesarios
Necesitas copiar estos archivos a `/opt/ecommerce/`:

- `docker-compose.prod-hub.yml`
- `nginx/nginx.conf`
- `env.example`
- `deploy-ec2.sh`
- `setup-ec2.sh`

**Opción A: Usando SCP desde tu máquina local**
```bash
scp -i tu-key.pem docker-compose.prod-hub.yml ubuntu@tu-ec2-public-ip:/opt/ecommerce/
scp -i tu-key.pem nginx/nginx.conf ubuntu@tu-ec2-public-ip:/opt/ecommerce/nginx/
scp -i tu-key.pem env.example ubuntu@tu-ec2-public-ip:/opt/ecommerce/
scp -i tu-key.pem deploy-ec2.sh ubuntu@tu-ec2-public-ip:/opt/ecommerce/
```

**Opción B: Clonar el repositorio**
```bash
cd /opt/ecommerce
git clone https://github.com/tu-usuario/tu-repo.git .
```

### 3. Configurar Variables de Entorno

#### 3.1 Crear el archivo .env
```bash
cd /opt/ecommerce
cp env.example .env
nano .env
```

#### 3.2 Configurar las variables
Edita el archivo `.env` con tus valores:

```bash
# Backend Configuration (External Instance)
BACKEND_HOST=tu-backend-ec2-ip.com
BACKEND_PORT=3000

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://tu-frontend-ec2-ip.com/api

# Docker Hub Configuration
IMAGE_TAG=latest
```

**Valores importantes a configurar:**
- `BACKEND_HOST`: IP pública o dominio de tu instancia backend
- `BACKEND_PORT`: Puerto del backend (normalmente 3000)
- `NEXT_PUBLIC_API_URL`: URL completa de tu API (puede ser la IP pública del frontend)

### 4. Configurar Security Groups

#### 4.1 En la consola de AWS EC2:
- **Frontend Security Group**: Permitir puertos 22 (SSH), 80 (HTTP), 443 (HTTPS)
- **Backend Security Group**: Permitir puertos 22 (SSH), 3000 (API)

#### 4.2 Verificar conectividad
```bash
# Desde la instancia frontend, probar conectividad al backend
curl http://tu-backend-ip:3000/health
```

### 5. Ejecutar el Deployment

#### 5.1 Navegar al directorio
```bash
cd /opt/ecommerce
```

#### 5.2 Ejecutar el script de deployment
```bash
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

### 6. Verificar el Deployment

#### 6.1 Verificar contenedores
```bash
docker-compose -f docker-compose.prod-hub.yml ps
```

#### 6.2 Verificar logs
```bash
docker-compose -f docker-compose.prod-hub.yml logs
```

#### 6.3 Probar la aplicación
```bash
# Obtener la IP pública de la instancia
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Probar la aplicación
curl http://tu-ec2-public-ip
```

## 🔧 Configuración de SSL (Opcional)

### 1. Obtener certificados SSL
```bash
# Instalar Certbot
sudo apt-get install certbot

# Obtener certificado (reemplaza con tu dominio)
sudo certbot certonly --standalone -d tu-dominio.com
```

### 2. Configurar nginx con SSL
```bash
# Copiar certificados
sudo cp /etc/letsencrypt/live/tu-dominio.com/fullchain.pem /opt/ecommerce/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/tu-dominio.com/privkey.pem /opt/ecommerce/nginx/ssl/key.pem
sudo chown ubuntu:ubuntu /opt/ecommerce/nginx/ssl/*.pem
```

### 3. Habilitar HTTPS en nginx.conf
Editar `nginx/nginx.conf` y descomentar la sección HTTPS.

### 4. Actualizar docker-compose
Agregar el puerto 443 en `docker-compose.prod-hub.yml`.

### 5. Reiniciar servicios
```bash
./deploy-ec2.sh
```

## 🛠️ Comandos Útiles

### Ver logs en tiempo real
```bash
docker-compose -f docker-compose.prod-hub.yml logs -f
```

### Reiniciar servicios
```bash
docker-compose -f docker-compose.prod-hub.yml restart
```

### Parar servicios
```bash
docker-compose -f docker-compose.prod-hub.yml down
```

### Actualizar imagen
```bash
docker-compose -f docker-compose.prod-hub.yml pull
docker-compose -f docker-compose.prod-hub.yml up -d
```

### Limpiar Docker
```bash
docker system prune -f
docker volume prune -f
```

## 🔍 Troubleshooting

### Problema: Contenedores no inician
```bash
# Verificar logs
docker-compose -f docker-compose.prod-hub.yml logs

# Verificar configuración
docker-compose -f docker-compose.prod-hub.yml config
```

### Problema: No se puede acceder desde internet
- Verificar Security Groups en AWS
- Verificar firewall local: `sudo ufw status`
- Verificar puertos: `netstat -tlnp`

### Problema: Backend no responde
```bash
# Verificar conectividad
curl http://tu-backend-ip:3000/health

# Verificar DNS
nslookup tu-backend-ip
```

### Problema: Imagen no se descarga
```bash
# Verificar acceso a Docker Hub
docker pull fr0ste/ecomm-front:latest

# Verificar credenciales si es necesario
docker login
```

## 📊 Monitoreo

### Verificar uso de recursos
```bash
# Uso de CPU y memoria
docker stats

# Espacio en disco
df -h

# Logs del sistema
sudo journalctl -u docker
```

### Health checks automáticos
Los contenedores incluyen health checks que puedes monitorear:
```bash
docker-compose -f docker-compose.prod-hub.yml ps
```

## 🔄 Actualizaciones

### Actualizar la aplicación
```bash
cd /opt/ecommerce
./deploy-ec2.sh
```

### Actualizar configuración
1. Editar archivos de configuración
2. Ejecutar `./deploy-ec2.sh`

### Rollback
```bash
# Cambiar IMAGE_TAG en .env
# Ejecutar deploy
./deploy-ec2.sh
```

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs: `docker-compose -f docker-compose.prod-hub.yml logs`
2. Verificar configuración de red
3. Verificar variables de entorno
4. Consultar la documentación de troubleshooting

---

**Nota**: Asegúrate de reemplazar todas las referencias a `tu-usuario`, `tu-repo`, `tu-ec2-public-ip`, `tu-backend-ip`, y `tu-dominio.com` con tus valores reales. 