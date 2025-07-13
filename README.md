# Tienda Online - Frontend Next.js

Frontend moderno para una tienda online desarrollado con Next.js 15, TypeScript, Tailwind CSS y Redux Toolkit.

## Características

- 🔐 **Autenticación completa**: Login y registro con JWT
- 🛍️ **Gestión de productos**: Catálogo, filtros, búsqueda
- 🛒 **Carrito de compras**: Añadir, actualizar, eliminar productos
- 💳 **Proceso de compra**: Checkout con formularios de envío
- 👤 **Perfil de usuario**: Gestión de datos personales
- 📦 **Historial de pedidos**: Seguimiento de compras
- 📱 **Diseño responsive**: Optimizado para móvil, tablet y escritorio
- ⚡ **Rendimiento optimizado**: Lazy loading, SSR, optimización de imágenes

## Tecnologías

- **Next.js 15** - Framework de React con App Router
- **TypeScript 5.7** - Tipado estático
- **Tailwind CSS 3.4** - Framework de CSS
- **Redux Toolkit 2.2** - Gestión de estado
- **React Hook Form 7.54** - Formularios
- **Axios 1.7** - Cliente HTTP
- **js-cookie 3.0** - Manejo de cookies

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp env.example.local .env.local
```

Edita `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3002
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3002](http://localhost:3002) en tu navegador.

## Configuración de Puertos

- **Frontend**: `http://localhost:3002`
- **Backend**: `http://localhost:3000`
- **Base de datos**: `localhost:5432`

## Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── auth/              # Páginas de autenticación
│   ├── products/          # Páginas de productos
│   ├── cart/              # Página del carrito
│   ├── checkout/          # Página de checkout
│   ├── profile/           # Página de perfil
│   ├── orders/            # Página de pedidos
│   └── _components/       # Componentes del layout
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Button, Input, etc.)
│   ├── forms/            # Formularios
│   ├── layout/           # Layout components
│   └── feedback/         # Componentes de feedback
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuración
│   └── api/             # Cliente API y endpoints
├── store/               # Redux store y slices
├── types/               # Tipos TypeScript
└── styles/              # Estilos globales
```

## API Endpoints

El frontend está configurado para consumir una API NestJS en el puerto 3000:

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrarse
- `GET /auth/profile` - Obtener perfil del usuario
- `POST /auth/logout` - Cerrar sesión

### Productos
- `GET /products` - Obtener catálogo de productos
- `GET /products/:id` - Obtener detalle de producto
- `GET /products/featured` - Productos destacados
- `GET /products/categories` - Categorías de productos

### Carrito
- `GET /cart` - Obtener carrito del usuario
- `POST /cart/items` - Añadir producto al carrito
- `PUT /cart/items/:id` - Actualizar cantidad
- `DELETE /cart/items/:id` - Eliminar del carrito

### Pedidos
- `POST /orders` - Crear pedido
- `GET /orders` - Obtener historial de pedidos
- `GET /orders/:id` - Obtener detalle de pedido

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo (puerto 3002)
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Ejecutar ESLint
- `npm run type-check` - Verificar tipos TypeScript
- `npm run check-backend` - Verificar conectividad con el backend
- `npm run dev:check` - Verificar backend y iniciar desarrollo

## Características de Seguridad

- ✅ Protección de rutas privadas con middleware
- ✅ Manejo seguro de JWT en cookies
- ✅ Validación de formularios
- ✅ Interceptores de API para manejo de errores
- ✅ Redirección automática en caso de token expirado

## Cambios en Next.js 15

- **App Router estable**: El App Router ya no es experimental
- **Mejor rendimiento**: Optimizaciones de compilación y runtime
- **TypeScript mejorado**: Mejor soporte para tipos
- **Imágenes optimizadas**: Configuración `remotePatterns` en lugar de `domains`

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 