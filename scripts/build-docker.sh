#!/bin/bash

# Build Docker Image Script for E-commerce Frontend
# This script builds the Docker image with proper error handling

set -e

echo "🐳 Building Docker image for E-commerce Frontend..."

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
IMAGE_NAME="fr0ste/ecomm-front"
TAG=${1:-latest}
DOCKERFILE="Dockerfile"

print_status "Using tag: $TAG"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Dockerfile exists
if [ ! -f "$DOCKERFILE" ]; then
    print_error "Dockerfile not found in current directory."
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the frontend directory."
    exit 1
fi

# Clean up any existing build artifacts
print_status "Cleaning up previous build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Build the Docker image
print_status "Building Docker image..."
print_status "Image: $IMAGE_NAME:$TAG"

# Build with detailed output and error handling
if docker build \
    --progress=plain \
    --no-cache \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    -t "$IMAGE_NAME:$TAG" \
    -t "$IMAGE_NAME:latest" \
    -f "$DOCKERFILE" \
    .; then
    
    print_status "✅ Docker image built successfully!"
    print_status "Images created:"
    echo "  - $IMAGE_NAME:$TAG"
    echo "  - $IMAGE_NAME:latest"
    
    # Show image size
    print_status "Image size:"
    docker images "$IMAGE_NAME:$TAG" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
    
    # Test the image
    print_status "Testing image..."
    if docker run --rm -d --name test-frontend -p 3000:3000 "$IMAGE_NAME:$TAG" > /dev/null 2>&1; then
        sleep 5
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            print_status "✅ Image test successful!"
        else
            print_warning "⚠️  Image test failed - container might not be responding"
        fi
        docker stop test-frontend > /dev/null 2>&1 || true
    else
        print_warning "⚠️  Could not start test container"
    fi
    
else
    print_error "❌ Docker build failed!"
    print_error "Check the build logs above for details."
    exit 1
fi

print_status "🎉 Build completed successfully!"
print_status "To run the image locally:"
echo "  docker run -p 3000:3000 $IMAGE_NAME:$TAG"
print_status "To push to Docker Hub:"
echo "  docker push $IMAGE_NAME:$TAG"
echo "  docker push $IMAGE_NAME:latest" 