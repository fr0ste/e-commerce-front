# 🔧 Guía de Solución de Problemas

Esta guía te ayudará a resolver los problemas más comunes que pueden surgir al desarrollar y desplegar la aplicación e-commerce.

## 🚨 Errores 404 en `/auth/profile`

### Problema
```
GET /auth/profile 404 in 60ms
GET /auth/profile 404 in 68ms
...
```

### Causa
El frontend está intentando hacer peticiones al backend para obtener el perfil del usuario, pero el backend no está corriendo o no está accesible.

### Solución

1. **Verificar si el backend está corriendo**:
   ```bash
   npm run check-backend
   ```

2. **Si el backend no está corriendo, iniciarlo**:
   ```bash
   # En el directorio del backend
   cd ../backend
   npm run start:dev
   ```

3. **Verificar la URL del backend**:
   - Crear archivo `.env.local` en el directorio frontend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Reiniciar el frontend**:
   ```bash
   npm run dev
   ```

## 🔗 Problemas de Conectividad

### Verificar conectividad del backend
```bash
# Verificar si el backend responde
curl http://localhost:3000/health

# Verificar desde el frontend
npm run check-backend
```

### Si el backend no responde:
1. **Verificar que el backend esté corriendo en el puerto 3000**
2. **Verificar el puerto correcto**
3. **Verificar firewall/antivirus**
4. **Verificar que no haya conflictos de puertos**

## 🌐 Configuración de Puertos

### Puertos por defecto:
- **Frontend**: `http://localhost:3002`
- **Backend**: `http://localhost:3000`
- **Base de datos**: `localhost:5432`

### Verificar puertos en uso:
```bash
# Verificar puerto del frontend
ss -tulpn | grep :3002

# Verificar puerto del backend
ss -tulpn | grep :3000

# Verificar puerto de la base de datos
ss -tulpn | grep :5432
```

## 🐳 Problemas con Docker

### Error: "Cannot connect to the Docker daemon"
```bash
# Verificar que Docker esté corriendo
sudo systemctl status docker

# Iniciar Docker si no está corriendo
sudo systemctl start docker
```

### Error: "Port already in use"
```bash
# Verificar puertos en uso
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3002

# Detener servicios que usen esos puertos
sudo systemctl stop apache2  # si Apache está usando el puerto
```

## 🔐 Problemas de Autenticación

### Token inválido o expirado
1. **Limpiar cookies del navegador**
2. **Verificar que el backend genere tokens válidos**
3. **Verificar la configuración JWT**

### Error 401 Unauthorized
1. **Verificar que el token se envíe correctamente**
2. **Verificar que el backend valide el token**
3. **Verificar la configuración CORS**

## 📱 Problemas de Desarrollo

### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "TypeScript compilation failed"
```bash
# Verificar tipos
npm run type-check

# Limpiar cache de TypeScript
rm -rf .next
npm run dev
```

### Error: "Hot reload not working"
1. **Verificar que no haya errores de sintaxis**
2. **Reiniciar el servidor de desarrollo**
3. **Limpiar cache del navegador**

## 🌐 Problemas de Red

### CORS Errors
1. **Verificar configuración CORS en el backend**
2. **Verificar que las URLs coincidan**
3. **Verificar headers de respuesta**

### Network Timeout
1. **Aumentar timeout en la configuración**
2. **Verificar conectividad de red**
3. **Verificar que el backend no esté sobrecargado**

## 🚀 Problemas de Despliegue

### Error: "Build failed"
```bash
# Verificar errores de TypeScript
npm run type-check

# Verificar linting
npm run lint

# Limpiar cache
rm -rf .next
npm run build
```

### Error: "Environment variables not found"
1. **Verificar archivo .env.local**
2. **Verificar variables de entorno en producción**
3. **Verificar que las variables empiecen con NEXT_PUBLIC_**

## 📊 Monitoreo y Debugging

### Ver logs en tiempo real
```bash
# Frontend (puerto 3002)
npm run dev

# Backend (puerto 3000)
cd ../backend && npm run start:dev

# Backend (si está en Docker)
docker-compose logs -f backend

# Nginx
docker-compose logs -f nginx
```

### Verificar estado de servicios
```bash
# Verificar contenedores Docker
docker-compose ps

# Verificar recursos del sistema
docker stats
```

### Debugging avanzado
```bash
# Modo debug
npm run debug

# Verificar conectividad
npm run check-backend
```

## 🔧 Comandos Útiles

### Limpiar todo y reinstalar
```bash
# Frontend
rm -rf node_modules .next package-lock.json
npm install
npm run dev

# Backend
cd ../backend
rm -rf node_modules package-lock.json
npm install
npm run start:dev
```

### Verificar configuración
```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_API_URL

# Verificar puertos
netstat -tulpn | grep :3000
netstat -tulpn | grep :3002

# Verificar Docker
docker --version
docker-compose --version
```

### URLs de acceso
```bash
# Frontend
http://localhost:3002

# Backend API
http://localhost:3000

# Backend Health Check
http://localhost:3000/health

# Swagger Documentation
http://localhost:3000/api
```

## 📞 Obtener Ayuda

Si los problemas persisten:

1. **Revisar logs completos**
2. **Verificar configuración de red**
3. **Verificar que todas las dependencias estén actualizadas**
4. **Crear un issue en el repositorio con logs detallados**

### Información útil para debugging:
- Versión de Node.js: `node --version`
- Versión de npm: `npm --version`
- Sistema operativo: `uname -a`
- Logs de error completos
- Configuración de red
- Variables de entorno (sin valores sensibles) 