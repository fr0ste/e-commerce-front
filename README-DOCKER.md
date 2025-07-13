# 🐳 E-commerce Application - Docker Setup

This repository contains a complete Docker setup for deploying the full-stack e-commerce application on AWS EC2 or any other cloud platform.

## 📁 Project Structure

```
ecommerce-fullstack/
├── frontend/                 # Next.js React Application
│   ├── Dockerfile           # Multi-stage build for production
│   ├── .dockerignore        # Excludes unnecessary files
│   └── next.config.js       # Updated with standalone output
├── backend/                  # NestJS API Server
│   ├── Dockerfile           # Multi-stage build for production
│   ├── .dockerignore        # Excludes unnecessary files
│   └── src/app.controller.ts # Added health endpoint
├── nginx/                    # Reverse Proxy Configuration
│   └── nginx.conf           # Production-ready Nginx config
├── docker-compose.prod.yml  # Production orchestration
├── docker-compose.dev.yml   # Development orchestration
├── deploy.sh                # Automated deployment script
├── setup-ec2.sh            # EC2 instance setup script
├── env.example              # Environment variables template
└── DEPLOYMENT.md            # Detailed deployment guide
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ecommerce-fullstack
   ```

2. **Start development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Database: localhost:5432

### Production Deployment

1. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your production values
   ```

2. **Deploy to production**:
   ```bash
   ./deploy.sh
   ```

## 🏗️ Architecture

### Services

1. **Frontend (Next.js)**
   - Port: 3001 (external), 3000 (internal)
   - Multi-stage Docker build
   - Standalone output for optimization
   - Production-ready with security headers

2. **Backend (NestJS)**
   - Port: 3000
   - Multi-stage Docker build
   - Health check endpoint at `/health`
   - JWT authentication
   - PostgreSQL database connection

3. **Database (PostgreSQL)**
   - Port: 5432
   - Persistent volume storage
   - Health checks enabled
   - Production-ready configuration

4. **Reverse Proxy (Nginx)**
   - Ports: 80 (HTTP), 443 (HTTPS)
   - SSL/TLS support
   - Load balancing
   - Rate limiting
   - Security headers
   - Gzip compression

### Network Architecture

```
Internet → Nginx (80/443) → Frontend (3001) / Backend (3000) → Database (5432)
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Database Configuration
POSTGRES_DB=ecommerce
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# API Configuration
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### SSL Configuration

For production SSL:

1. **Obtain certificates** (Let's Encrypt):
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

2. **Update Nginx config**:
   - Uncomment SSL lines in `nginx/nginx.conf`
   - Copy certificates to `nginx/ssl/`

3. **Restart Nginx**:
   ```bash
   docker-compose -f docker-compose.prod.yml restart nginx
   ```

## 📊 Monitoring & Health Checks

### Health Endpoints

- **Backend**: `http://localhost:3000/health`
- **Frontend**: `http://localhost:3001`
- **Nginx**: `http://localhost:80`

### Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs nginx
```

### Service Status

```bash
docker-compose -f docker-compose.prod.yml ps
```

## 🔒 Security Features

### Implemented Security Measures

1. **Docker Security**:
   - Non-root users in containers
   - Multi-stage builds to reduce attack surface
   - Minimal base images (Alpine Linux)

2. **Network Security**:
   - Isolated Docker networks
   - Firewall configuration
   - Rate limiting in Nginx

3. **Application Security**:
   - JWT token authentication
   - Secure headers in Nginx
   - HTTPS redirect
   - CORS configuration

4. **Database Security**:
   - Strong passwords
   - Network isolation
   - Health checks

## 🚀 EC2 Deployment

### Automated Setup

1. **Upload files to EC2**:
   ```bash
   scp -r -i your-key.pem . ubuntu@your-ec2-ip:/home/ubuntu/ecommerce
   ```

2. **Run setup script**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   cd /home/ubuntu/ecommerce
   chmod +x setup-ec2.sh
   ./setup-ec2.sh
   ```

3. **Configure and deploy**:
   ```bash
   sudo nano /opt/ecommerce/.env  # Edit environment variables
   cd /opt/ecommerce
   ./deploy.sh
   ```

### Manual Setup

If you prefer manual setup, follow the detailed guide in `DEPLOYMENT.md`.

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### Database Backup

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres ecommerce > backup.sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres ecommerce < backup.sql
```

### Clean Up

```bash
# Remove unused containers and images
docker system prune -f

# Remove volumes (WARNING: This will delete data)
docker volume prune
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   sudo netstat -tulpn | grep :80
   sudo systemctl stop apache2  # if Apache is running
   ```

2. **Permission issues**:
   ```bash
   sudo usermod -aG docker $USER
   # Log out and log back in
   ```

3. **Database connection**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs postgres
   ```

4. **Memory issues**:
   ```bash
   free -h
   # Consider increasing swap or instance size
   ```

### Debug Commands

```bash
# Check container logs
docker-compose -f docker-compose.prod.yml logs -f

# Enter container shell
docker-compose -f docker-compose.prod.yml exec backend sh
docker-compose -f docker-compose.prod.yml exec frontend sh

# Check network connectivity
docker-compose -f docker-compose.prod.yml exec backend ping postgres
```

## 📈 Scaling Considerations

### For Higher Traffic

1. **Increase resources**:
   - Larger EC2 instance
   - More CPU/memory allocation

2. **Add load balancing**:
   - AWS Application Load Balancer
   - Multiple instances

3. **Database optimization**:
   - Use RDS instead of containerized PostgreSQL
   - Add read replicas

4. **Caching**:
   - Add Redis for session storage
   - Implement CDN for static assets

5. **Monitoring**:
   - Add Prometheus/Grafana
   - Set up alerts

## 📝 Scripts Reference

### Available Scripts

- `deploy.sh` - Production deployment
- `setup-ec2.sh` - EC2 instance setup
- `docker-compose.prod.yml` - Production orchestration
- `docker-compose.dev.yml` - Development orchestration

### Usage Examples

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Dockerizing! 🐳** 