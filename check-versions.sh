#!/bin/bash

# Version Check Script for E-commerce Frontend Application
# This script shows available versions and current running version of the frontend
# Backend is expected to be running on a separate instance

set -e

echo "📋 E-commerce Frontend Version Check..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed."
    exit 1
fi

print_header "=== Current Running Version ==="

# Get current version from .env file
if [ -f .env ]; then
    CURRENT_VERSION=$(grep IMAGE_TAG .env | cut -d'=' -f2)
    print_status "Current version in .env: $CURRENT_VERSION"
else
    print_warning ".env file not found"
fi

# Get running container versions
print_status "Running container versions:"
if docker-compose -f docker-compose.prod-hub.yml ps | grep -q "Up"; then
    FRONTEND_VERSION=$(docker-compose -f docker-compose.prod-hub.yml exec -T frontend sh -c "echo \$IMAGE_TAG" 2>/dev/null || echo "unknown")
    
    echo "  Frontend: $FRONTEND_VERSION"
else
    print_warning "No containers are currently running"
fi

print_header "=== Local Images ==="

# Show local frontend images
print_status "Local Frontend Images:"
if docker images fr0ste/ecomm-front --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" | grep -v REPOSITORY; then
    echo ""
else
    print_warning "No local frontend images found"
fi

print_header "=== Available Tags on Docker Hub ==="

# Check if user is logged in to Docker Hub
if docker info | grep -q "Username"; then
    print_status "Checking available tags on Docker Hub..."
    
    # Get available tags for frontend
    print_status "Frontend tags:"
    if curl -s "https://registry.hub.docker.com/v2/repositories/fr0ste/ecomm-front/tags/" | jq -r '.results[].name' 2>/dev/null | head -10; then
        echo ""
    else
        print_warning "Could not fetch frontend tags from Docker Hub"
    fi
else
    print_warning "Not logged in to Docker Hub. Run 'docker login' to see available tags."
fi

print_header "=== Backend Connectivity ==="

# Load environment variables
if [ -f .env ]; then
    source .env
    
    if [ -n "$BACKEND_HOST" ] && [ -n "$BACKEND_PORT" ]; then
        print_status "Checking backend connectivity..."
        if curl -f "http://$BACKEND_HOST:$BACKEND_PORT/health" > /dev/null 2>&1; then
            print_status "✅ Backend is reachable at $BACKEND_HOST:$BACKEND_PORT"
        else
            print_error "❌ Backend health check failed at $BACKEND_HOST:$BACKEND_PORT"
        fi
    else
        print_warning "BACKEND_HOST or BACKEND_PORT not configured in .env"
    fi
else
    print_warning ".env file not found - cannot check backend connectivity"
fi

print_header "=== Health Status ==="

# Check health status
if docker-compose -f docker-compose.prod-hub.yml ps | grep -q "Up"; then
    print_status "Checking service health..."
    
    # Check frontend health
    if curl -f http://localhost:3001 > /dev/null 2>&1; then
        print_status "✅ Frontend is healthy"
    else
        print_error "❌ Frontend health check failed"
    fi
    
    # Check nginx health
    if curl -f http://localhost:80 > /dev/null 2>&1; then
        print_status "✅ Nginx is healthy"
    else
        print_error "❌ Nginx health check failed"
    fi
    
    # Test API proxy if backend is configured
    if [ -n "$BACKEND_HOST" ] && [ -n "$BACKEND_PORT" ]; then
        if curl -f http://localhost:80/api/health > /dev/null 2>&1; then
            print_status "✅ API proxy is working"
        else
            print_warning "⚠️  API proxy test failed"
        fi
    fi
else
    print_warning "No services are currently running"
fi

print_header "=== Usage Examples ==="

echo "To deploy a specific version:"
echo "  export IMAGE_TAG=v1.0.0 && ./deploy-hub.sh"
echo ""
echo "To rollback to a previous version:"
echo "  ./rollback.sh v1.0.0"
echo ""
echo "To pull latest images:"
echo "  docker-compose -f docker-compose.prod-hub.yml pull"
echo ""
echo "To see detailed logs:"
echo "  docker-compose -f docker-compose.prod-hub.yml logs -f" 