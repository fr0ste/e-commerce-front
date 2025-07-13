# 🐳 Docker Hub Frontend Deployment Guide

Esta guía te ayudará a desplegar el frontend de la aplicación e-commerce usando imágenes pre-construidas de Docker Hub, conectándose a un backend externo.

## 📋 Ventajas del Despliegue con Docker Hub

- ✅ **Despliegue más rápido** - No necesitas construir imágenes en EC2
- ✅ **Menor uso de recursos** - EC2 solo descarga las imágenes
- ✅ **CI/CD automatizado** - GitHub Actions construye y sube las imágenes
- ✅ **Rollbacks fáciles** - Puedes cambiar entre versiones rápidamente
- ✅ **Escalabilidad** - Múltiples instancias pueden usar las mismas imágenes
- ✅ **Separación de responsabilidades** - Frontend y backend en instancias separadas

## 🏗️ Arquitectura

```
GitHub → GitHub Actions → Docker Hub → Frontend EC2 Instance
   ↓           ↓              ↓           ↓
   Code    Build Images   Store Images  Pull & Run
                                    ↓
                              Backend EC2 Instance
```

## 🚀 Flujo de Trabajo

### 1. Desarrollo Local

```bash
# Construir y probar localmente
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Push a GitHub

```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

### 3. GitHub Actions (Automático)

- GitHub Actions detecta el push
- Construye la imagen Docker del frontend
- La sube a Docker Hub con tags automáticos
- Actualiza el tag `latest`

### 4. Despliegue en EC2

```bash
# En tu instancia EC2 del frontend
cd /opt/ecommerce
./deploy-hub.sh
```

## 🔧 Configuración Inicial

### 1. Configurar Docker Hub

1. **Crear cuenta en Docker Hub**: https://hub.docker.com
2. **Crear repositorio**:
   - `fr0ste/ecomm-front`

### 2. Configurar GitHub Secrets

En tu repositorio de GitHub, ve a `Settings > Secrets and variables > Actions` y agrega:

- `DOCKERHUB_USERNAME`: Tu nombre de usuario de Docker Hub
- `DOCKERHUB_TOKEN`: Tu token de acceso de Docker Hub

Para crear el token:
1. Ve a Docker Hub → Account Settings → Security
2. Click en "New Access Token"
3. Dale un nombre y copia el token

### 3. Configurar EC2 Frontend

```bash
# Subir archivos de configuración
scp -r -i tu-key.pem . ubuntu@tu-frontend-ec2-ip:/home/ubuntu/ecommerce

# Configurar EC2
ssh -i tu-key.pem ubuntu@tu-frontend-ec2-ip
cd /home/ubuntu/ecommerce
chmod +x setup-ec2-hub.sh
./setup-ec2-hub.sh
```

## 📦 Construir y Subir Imágenes Manualmente

Si necesitas construir y subir imágenes manualmente:

```bash
# Login a Docker Hub
docker login

# Construir y subir frontend
./build-and-push.sh [tag]

# Ejemplo con tag específico
./build-and-push.sh v1.0.0
```

## 🚀 Despliegue en Producción

### Opción 1: Despliegue Automático

1. **Configurar variables de entorno**:
   ```bash
   sudo nano /opt/ecommerce/.env
   ```

   ```env
   # Backend Configuration (External Instance)
   BACKEND_HOST=tu-backend-ec2-ip.com
   BACKEND_PORT=3000
   
   # Frontend Configuration
   NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
   
   # Docker Hub Configuration
   IMAGE_TAG=latest
   ```

2. **Desplegar**:
   ```bash
   cd /opt/ecommerce
   ./deploy-hub.sh
   ```

### Opción 2: Despliegue con Tag Específico

```bash
# Cambiar a una versión específica
export IMAGE_TAG=v1.0.0
./deploy-hub.sh
```

### Opción 3: Rollback

```bash
# Volver a una versión anterior
./rollback.sh v0.9.0
```

## 🔄 Actualizaciones

### Flujo de Actualización

1. **Desarrollar cambios** localmente
2. **Push a GitHub** (main/master branch)
3. **GitHub Actions** construye y sube nueva imagen del frontend
4. **En EC2 Frontend**, ejecutar `./deploy-hub.sh` para actualizar

### Comandos Útiles

```bash
# Ver imágenes disponibles
docker images fr0ste/ecomm-front

# Ver logs de despliegue
docker-compose -f docker-compose.prod-hub.yml logs -f

# Verificar estado
docker-compose -f docker-compose.prod-hub.yml ps

# Health checks
curl http://localhost:3001         # Frontend
curl http://localhost:80/api/health # Backend through proxy
```

## 📊 Monitoreo

### Health Checks

- **Frontend**: `http://tu-ip:3001`
- **Nginx**: `http://tu-ip:80`
- **Backend Proxy**: `http://tu-ip:80/api/health`

### Logs

```bash
# Todos los servicios
docker-compose -f docker-compose.prod-hub.yml logs

# Servicio específico
docker-compose -f docker-compose.prod-hub.yml logs frontend
docker-compose -f docker-compose.prod-hub.yml logs nginx
```

## 🔒 Seguridad

### Mejores Prácticas

1. **Usar tags específicos** en producción, no `latest`
2. **Escanear imágenes** en busca de vulnerabilidades
3. **Rotar secrets** regularmente
4. **Monitorear logs** de acceso
5. **Usar HTTPS** en producción
6. **Configurar firewall** entre frontend y backend

### Configuración de Seguridad

```bash
# Verificar imágenes descargadas
docker scan fr0ste/ecomm-front:latest

# Verificar permisos
ls -la /opt/ecommerce/.env

# Verificar conectividad con backend
curl -f http://$BACKEND_HOST:$BACKEND_PORT/health
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de autenticación Docker Hub**:
   ```bash
   docker login
   ```

2. **Imagen no encontrada**:
   ```bash
   docker pull fr0ste/ecomm-front:latest
   ```

3. **Backend no accesible**:
   ```bash
   # Verificar conectividad
   curl -f http://$BACKEND_HOST:$BACKEND_PORT/health
   
   # Verificar configuración de red
   ping $BACKEND_HOST
   ```

4. **Puertos ocupados**:
   ```bash
   sudo netstat -tulpn | grep :80
   sudo systemctl stop apache2  # si Apache está corriendo
   ```

### Debug

```bash
# Verificar configuración
docker-compose -f docker-compose.prod-hub.yml config

# Entrar a contenedores
docker-compose -f docker-compose.prod-hub.yml exec frontend sh
docker-compose -f docker-compose.prod-hub.yml exec nginx sh

# Verificar conectividad con backend
curl -v http://$BACKEND_HOST:$BACKEND_PORT/health
```

## 📈 Escalabilidad

### Múltiples Instancias Frontend

1. **Crear múltiples instancias EC2** para frontend
2. **Usar el mismo docker-compose.prod-hub.yml**
3. **Configurar load balancer** (AWS ALB)
4. **Compartir backend** entre todas las instancias frontend

### Configuración de Load Balancer

```yaml
# Ejemplo de configuración para múltiples instancias frontend
services:
  frontend:
    image: fr0ste/ecomm-front:latest
    deploy:
      replicas: 3
```

## 📝 Scripts Disponibles

- `build-and-push.sh` - Construir y subir imagen del frontend a Docker Hub
- `deploy-hub.sh` - Desplegar frontend usando imagen de Docker Hub
- `setup-ec2-hub.sh` - Configurar EC2 para frontend con Docker Hub
- `rollback.sh` - Rollback a versión específica del frontend
- `check-versions.sh` - Verificar versiones disponibles y conectividad
- `docker-compose.prod-hub.yml` - Orquestación del frontend con Docker Hub

## 🎯 Próximos Pasos

1. **Configurar GitHub Actions** con los secrets
2. **Hacer push inicial** para construir la primera imagen del frontend
3. **Configurar EC2 Frontend** con el script optimizado
4. **Configurar backend** en instancia separada
5. **Desplegar frontend** usando la imagen de Docker Hub
6. **Configurar monitoreo** y alertas
7. **Implementar CI/CD** completo

## 🔗 Conectividad Backend

### Configuración de Red

Asegúrate de que tu instancia frontend pueda acceder al backend:

1. **Security Groups**: Configurar reglas de entrada/salida
2. **VPC**: Asegurar que ambas instancias estén en la misma VPC o tengan conectividad
3. **DNS**: Usar nombres de dominio o IPs fijas para el backend

### Variables de Entorno

```env
# Configuración del backend externo
BACKEND_HOST=tu-backend-ec2-ip.com
BACKEND_PORT=3000

# URL pública para el frontend
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
```

---

**¡Happy Frontend Docker Hub Deploying! 🐳** 