#!/bin/bash

# E-commerce Frontend Deployment Script for EC2
# This script deploys the frontend application on EC2 using Docker Hub images

set -e

echo "🚀 Starting E-commerce Frontend Deployment on EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.prod-hub.yml" ]; then
    print_error "docker-compose.prod-hub.yml not found. Please run this script from the application directory."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please run setup-ec2.sh first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please run setup-ec2.sh first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f env.example ]; then
        cp env.example .env
        print_warning "Please edit .env file with your production values before continuing."
        print_warning "Key values to configure:"
        echo "  - BACKEND_HOST: Your backend EC2 instance IP or domain"
        echo "  - BACKEND_PORT: Your backend port (usually 3000)"
        echo "  - NEXT_PUBLIC_API_URL: Your frontend domain or EC2 public IP"
        exit 1
    else
        print_error "env.example not found. Please create a .env file manually."
        exit 1
    fi
fi

# Load environment variables
source .env

# Check backend connectivity
print_status "Checking backend connectivity..."
if [ -n "$BACKEND_HOST" ] && [ -n "$BACKEND_PORT" ]; then
    if curl -f "http://$BACKEND_HOST:$BACKEND_PORT/health" > /dev/null 2>&1; then
        print_status "✅ Backend is reachable at $BACKEND_HOST:$BACKEND_PORT"
    else
        print_warning "⚠️  Backend health check failed at $BACKEND_HOST:$BACKEND_PORT"
        print_warning "Make sure the backend is running and accessible"
        print_warning "Continuing with deployment..."
    fi
else
    print_warning "⚠️  BACKEND_HOST or BACKEND_PORT not configured in .env"
    print_warning "Please configure these values for proper API connectivity"
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.prod-hub.yml down --remove-orphans || true

# Pull latest images from Docker Hub
print_status "Pulling latest frontend image from Docker Hub..."
docker-compose -f docker-compose.prod-hub.yml pull

# Remove old images to free up space
print_status "Cleaning up old Docker images..."
docker system prune -f

# Start services
print_status "Starting frontend services with Docker Hub images..."
docker-compose -f docker-compose.prod-hub.yml up -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check if frontend is responding
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    print_status "✅ Frontend is healthy"
else
    print_error "❌ Frontend health check failed"
    docker-compose -f docker-compose.prod-hub.yml logs frontend
    exit 1
fi

# Check if nginx is responding
if curl -f http://localhost:80 > /dev/null 2>&1; then
    print_status "✅ Nginx is healthy"
else
    print_error "❌ Nginx health check failed"
    docker-compose -f docker-compose.prod-hub.yml logs nginx
    exit 1
fi

# Test API connectivity through nginx
if [ -n "$BACKEND_HOST" ] && [ -n "$BACKEND_PORT" ]; then
    print_status "Testing API connectivity through nginx..."
    if curl -f http://ec2-18-118-129-110.us-east-2.compute.amazonaws.com:80/api/health > /dev/null 2>&1; then
        print_status "✅ API proxy is working correctly"
    else
        print_warning "⚠️  API proxy test failed - check backend connectivity"
    fi
fi

# Get EC2 public IP
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "unknown")

print_status "🎉 Frontend deployment completed successfully!"
print_status "Application is now running on:"
echo "  - Frontend: http://localhost:3001"
echo "  - Nginx Proxy: http://localhost:80"
if [ "$EC2_PUBLIC_IP" != "unknown" ]; then
    echo "  - Public Access: http://$EC2_PUBLIC_IP"
fi
if [ -n "$BACKEND_HOST" ]; then
    echo "  - Backend: http://$BACKEND_HOST"
fi

print_status "Using Docker Hub images:"
echo "  - Frontend: fr0ste/ecomm-front:${IMAGE_TAG:-latest}"

# Show running containers
print_status "Running containers:"
docker-compose -f docker-compose.prod-hub.yml ps

# Show logs
print_status "Recent logs:"
docker-compose -f docker-compose.prod-hub.yml logs --tail=20

print_status "Deployment completed! Your application should be accessible at:"
if [ "$EC2_PUBLIC_IP" != "unknown" ]; then
    echo "  http://$EC2_PUBLIC_IP"
else
    echo "  http://your-ec2-public-ip"
fi 