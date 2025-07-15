#!/bin/bash

# Build and Push Frontend Docker Image to Docker Hub
# This script builds and pushes the frontend image only
# Backend is expected to be running on a separate instance

set -e

echo "🐳 Building and pushing Frontend Docker image to Docker Hub..."

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

# Configuration
FRONTEND_IMAGE="fr0ste/ecomm-front"
TAG=${1:-latest}

print_status "Using tag: $TAG"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if user is logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    print_warning "You are not logged in to Docker Hub."
    print_warning "Please run: docker login"
    exit 1
fi

# Build Frontend Image
print_status "Building frontend image..."
docker build -t $FRONTEND_IMAGE:$TAG .
docker tag $FRONTEND_IMAGE:$TAG $FRONTEND_IMAGE:latest
cd ..

# Push Frontend Image
print_status "Pushing frontend image to Docker Hub..."
docker push $FRONTEND_IMAGE:$TAG
docker push $FRONTEND_IMAGE:latest

print_status "🎉 Frontend image has been built and pushed successfully!"
print_status "Images pushed:"
echo "  - $FRONTEND_IMAGE:$TAG"
echo "  - $FRONTEND_IMAGE:latest"

# Clean up local images to save space
print_status "Cleaning up local images..."
docker rmi $FRONTEND_IMAGE:$TAG $FRONTEND_IMAGE:latest || true
docker system prune -f

print_status "✅ Build and push completed successfully!"
print_status "Note: Backend should be deployed separately on its own instance." 