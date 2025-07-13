# 🐳 Docker Troubleshooting Guide

Esta guía te ayudará a resolver problemas comunes relacionados con Docker en el proyecto e-commerce.

## 🚨 Errores Comunes de Build

### Error: "ENV key value" format warnings

**Problema:**
```
LegacyKeyValueFormat: "ENV key=value" should be used instead of legacy "ENV key value" format
```

**Solución:**
Cambiar el formato ENV en el Dockerfile:
```dockerfile
# ❌ Formato legacy (incorrecto)
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# ✅ Formato moderno (correcto)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
```

### Error: "npm run build" failed

**Problema:**
```
ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
```

**Causas comunes:**
1. **Dependencias faltantes**: No se instalaron todas las dependencias
2. **Errores de TypeScript**: Errores de tipos en el código
3. **Variables de entorno**: Variables de entorno no configuradas
4. **Memoria insuficiente**: Build requiere más memoria

**Soluciones:**

1. **Verificar dependencias**:
   ```bash
   # Limpiar e instalar dependencias
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Verificar TypeScript**:
   ```bash
   npm run type-check
   ```

3. **Verificar linting**:
   ```bash
   npm run lint
   ```

4. **Build local para debug**:
   ```bash
   npm run build
   ```

5. **Usar script de build mejorado**:
   ```bash
   ./scripts/build-docker.sh
   ```

## 🔧 Comandos de Debugging

### Verificar Dockerfile
```bash
# Verificar sintaxis del Dockerfile
docker build --dry-run .

# Build con output detallado
docker build --progress=plain --no-cache .
```

### Verificar contexto de build
```bash
# Ver qué archivos se incluyen en el build
docker build --progress=plain . 2>&1 | grep "Sending build context"

# Verificar .dockerignore
cat .dockerignore
```

### Verificar imagen construida
```bash
# Listar imágenes
docker images fr0ste/ecomm-front

# Inspeccionar imagen
docker inspect fr0ste/ecomm-front:latest

# Ver historial de capas
docker history fr0ste/ecomm-front:latest
```

## 🚀 Scripts de Build

### Build local con script mejorado
```bash
# Build con tag específico
./scripts/build-docker.sh v1.0.0

# Build con tag latest
./scripts/build-docker.sh latest
```

### Build con npm scripts
```bash
# Build básico
npm run docker:build

# Build con tag
npm run docker:build:tag v1.0.0

# Test de imagen
npm run docker:test
```

## 📊 Optimización de Build

### Optimizar .dockerignore
```dockerfile
# Incluir solo archivos necesarios
node_modules
.next
.env*
*.log
.git
README.md
```

### Usar multi-stage build
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm ci
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
```

### Usar BuildKit
```bash
# Habilitar BuildKit
export DOCKER_BUILDKIT=1

# Build con cache
docker build --build-arg BUILDKIT_INLINE_CACHE=1 .
```

## 🌐 Problemas de Red

### Error: "Failed to fetch" en build
```bash
# Verificar conectividad
curl -f https://registry.npmjs.org/

# Usar mirror de npm
npm config set registry https://registry.npmjs.org/
```

### Error: "Connection timeout"
```bash
# Aumentar timeout
docker build --timeout 300 .

# Usar DNS alternativo
docker build --dns 8.8.8.8 .
```

## 🔐 Problemas de Autenticación

### Error: "Unauthorized" al hacer push
```bash
# Login a Docker Hub
docker login

# Verificar credenciales
docker info | grep Username
```

### Error: "Permission denied"
```bash
# Verificar permisos
ls -la Dockerfile

# Usar sudo si es necesario
sudo docker build .
```

## 📱 Problemas de Runtime

### Error: "Port already in use"
```bash
# Verificar puertos en uso
ss -tulpn | grep :3000

# Usar puerto diferente
docker run -p 3001:3000 fr0ste/ecomm-front:latest
```

### Error: "Container exited immediately"
```bash
# Ver logs del contenedor
docker logs <container_id>

# Ejecutar en modo interactivo
docker run -it fr0ste/ecomm-front:latest sh
```

## 🧪 Testing de Imágenes

### Test básico
```bash
# Ejecutar contenedor
docker run -d --name test-frontend -p 3000:3000 fr0ste/ecomm-front:latest

# Verificar que responde
curl -f http://localhost:3000

# Limpiar
docker stop test-frontend && docker rm test-frontend
```

### Test con health check
```bash
# Ejecutar con health check
docker run -d --name test-frontend \
  --health-cmd="curl -f http://localhost:3000 || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  -p 3000:3000 fr0ste/ecomm-front:latest
```

## 🔄 CI/CD Troubleshooting

### GitHub Actions

**Problema: Build falla en CI pero funciona localmente**
```yaml
# Agregar más memoria y tiempo
- name: Build and push Frontend image
  uses: docker/build-push-action@v5
  with:
    context: .
    file: ./Dockerfile
    push: true
    tags: ${{ env.FRONTEND_IMAGE }}:${{ steps.meta.outputs.version }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
    build-args: |
      BUILDKIT_INLINE_CACHE=1
    platforms: linux/amd64
```

**Problema: Cache no funciona**
```yaml
# Usar cache de GitHub Actions
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
  with:
    driver-opts: |
      image=moby/buildkit:latest
```

## 📝 Logs Útiles

### Ver logs de build
```bash
# Build con output detallado
docker build --progress=plain --no-cache . 2>&1 | tee build.log

# Analizar logs
grep -i error build.log
grep -i warning build.log
```

### Ver logs de contenedor
```bash
# Logs en tiempo real
docker logs -f <container_id>

# Últimas 100 líneas
docker logs --tail 100 <container_id>
```

## 🆘 Obtener Ayuda

Si los problemas persisten:

1. **Verificar versión de Docker**:
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Verificar recursos del sistema**:
   ```bash
   docker system df
   docker system prune
   ```

3. **Crear issue con información**:
   - Logs completos del build
   - Versión de Docker
   - Sistema operativo
   - Contenido del Dockerfile
   - Contenido del .dockerignore

### Información útil para debugging:
- Docker version: `docker --version`
- Docker Compose version: `docker-compose --version`
- Sistema operativo: `uname -a`
- Logs de build completos
- Configuración de red
- Variables de entorno (sin valores sensibles) 