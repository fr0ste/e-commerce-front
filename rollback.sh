#!/bin/bash

# Rollback Script for E-commerce Frontend Application
# This script allows you to rollback to a specific version of the frontend
# Backend is expected to be running on a separate instance

set -e

echo "🔄 E-commerce Frontend Rollback Script..."

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

# Check if version is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <version>"
    print_error "Example: $0 v1.0.0"
    print_error "Available versions:"
    docker images fr0ste/ecomm-front --format "table {{.Tag}}" | grep -v TAG || echo "No local images found"
    exit 1
fi

VERSION=$1

print_status "Rolling back frontend to version: $VERSION"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found."
    exit 1
fi

# Pull the specific version image
print_status "Pulling frontend version $VERSION from Docker Hub..."
docker pull fr0ste/ecomm-front:$VERSION

# Update .env file with the new version
print_status "Updating .env file with version $VERSION..."
sed -i "s/IMAGE_TAG=.*/IMAGE_TAG=$VERSION/" .env

# Stop current services
print_status "Stopping current services..."
docker-compose -f docker-compose.prod-hub.yml down

# Start services with the new version
print_status "Starting services with version $VERSION..."
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

print_status "🎉 Frontend rollback to version $VERSION completed successfully!"
print_status "Frontend is now running version $VERSION"

# Show running containers
print_status "Running containers:"
docker-compose -f docker-compose.prod-hub.yml ps

# Show current version
print_status "Current version in .env:"
grep IMAGE_TAG .env 