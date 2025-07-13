# E-commerce Application Deployment Guide

This guide will help you deploy the full-stack e-commerce application on an AWS EC2 instance using Docker.

## Prerequisites

- AWS EC2 instance (recommended: t3.medium or larger)
- Ubuntu 20.04+ or Amazon Linux 2
- SSH access to your EC2 instance
- Domain name (optional, for SSL)

## Architecture

The application consists of:
- **Frontend**: Next.js React application
- **Backend**: NestJS API server
- **Database**: PostgreSQL
- **Reverse Proxy**: Nginx with SSL support

## Quick Deployment

### Step 1: Set up EC2 Instance

1. **Launch EC2 Instance**:
   - Choose Ubuntu 20.04+ or Amazon Linux 2
   - Instance type: t3.medium (minimum)
   - Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **Connect to your instance**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

### Step 2: Upload Application Files

1. **Upload files to EC2**:
   ```bash
   scp -r -i your-key.pem . ubuntu@your-ec2-ip:/home/ubuntu/ecommerce
   ```

2. **SSH into your instance and run setup**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   cd /home/ubuntu/ecommerce
   chmod +x setup-ec2.sh
   ./setup-ec2.sh
   ```

### Step 3: Configure Environment

1. **Edit environment variables**:
   ```bash
   sudo nano /opt/ecommerce/.env
   ```

   Update with your production values:
   ```env
   POSTGRES_DB=ecommerce
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-secure-password
   JWT_SECRET=your-super-secret-jwt-key
   NEXT_PUBLIC_API_URL=http://your-ec2-ip/api
   ```

### Step 4: Deploy Application

1. **Navigate to application directory**:
   ```bash
   cd /opt/ecommerce
   ```

2. **Run deployment**:
   ```bash
   ./deploy.sh
   ```

## SSL Configuration (Optional)

For production with SSL:

1. **Obtain SSL certificates** (Let's Encrypt recommended):
   ```bash
   sudo apt-get install certbot
   sudo certbot certonly --standalone -d your-domain.com
   ```

2. **Update Nginx configuration**:
   Edit `/opt/ecommerce/nginx/nginx.conf` and uncomment SSL lines

3. **Copy certificates**:
   ```bash
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/ecommerce/nginx/ssl/cert.pem
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/ecommerce/nginx/ssl/key.pem
   sudo chown $USER:$USER /opt/ecommerce/nginx/ssl/*
   ```

4. **Restart services**:
   ```bash
   docker-compose -f docker-compose.prod.yml restart nginx
   ```

## Monitoring & Maintenance

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs backend
```

### Check Service Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

## Security Considerations

1. **Change default passwords** in `.env` file
2. **Use strong JWT secrets**
3. **Configure firewall** (already done in setup script)
4. **Enable SSL** for production
5. **Regular security updates**

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   sudo netstat -tulpn | grep :80
   sudo systemctl stop apache2  # if Apache is running
   ```

2. **Docker permission issues**:
   ```bash
   sudo usermod -aG docker $USER
   # Log out and log back in
   ```

3. **Database connection issues**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs postgres
   ```

## Health Checks

The application includes health checks:
- Backend: `http://your-ip:3000/health`
- Frontend: `http://your-ip:3001`
- Nginx: `http://your-ip:80` 