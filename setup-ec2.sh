#!/bin/bash

# EC2 Setup Script for E-commerce Application
# This script installs Docker and Docker Compose on a fresh EC2 instance

set -e

echo "🔧 Setting up EC2 instance for E-commerce Application..."

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

# Update system packages
print_status "Updating system packages..."
if command -v yum &> /dev/null; then
    # Amazon Linux / CentOS / RHEL
    sudo yum update -y
elif command -v apt-get &> /dev/null; then
    # Ubuntu / Debian
    sudo apt-get update -y
else
    print_error "Unsupported package manager"
    exit 1
fi

# Install required packages
print_status "Installing required packages..."
if command -v yum &> /dev/null; then
    # Amazon Linux / CentOS / RHEL
    sudo yum install -y git curl wget unzip
elif command -v apt-get &> /dev/null; then
    # Ubuntu / Debian
    sudo apt-get install -y git curl wget unzip
else
    print_error "Unsupported package manager"
    exit 1
fi

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_status "Docker installed successfully"
else
    print_status "Docker is already installed"
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    # Install Docker Compose v2
    sudo mkdir -p /usr/local/lib/docker/cli-plugins
    sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/lib/docker/cli-plugins/docker-compose
    sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
    
    # Also install as docker-compose for compatibility
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed successfully"
else
    print_status "Docker Compose is already installed"
fi

# Start and enable Docker service
print_status "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Configure firewall (if using ufw)
if command -v ufw &> /dev/null; then
    print_status "Configuring firewall..."
    sudo ufw allow 22/tcp   # SSH
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 443/tcp  # HTTPS
    sudo ufw --force enable
fi

# Configure firewall (if using firewalld)
if command -v firewall-cmd &> /dev/null; then
    print_status "Configuring firewall..."
    sudo firewall-cmd --permanent --add-service=ssh
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
fi

# Create application directory
print_status "Creating application directory..."
sudo mkdir -p /opt/ecommerce
sudo chown $USER:$USER /opt/ecommerce

# Create SSL directory
print_status "Creating SSL directory..."
sudo mkdir -p /opt/ecommerce/nginx/ssl
sudo chown $USER:$USER /opt/ecommerce/nginx/ssl

print_status "🎉 EC2 setup completed successfully!"
print_status "Next steps:"
echo "  1. Copy your application files to /opt/ecommerce/"
echo "  2. Edit /opt/ecommerce/.env with your production values"
echo "  3. Navigate to /opt/ecommerce directory"
echo "  4. Run: ./deploy-hub.sh"

# Show Docker version
print_status "Docker version:"
docker --version
docker-compose --version

print_status "Setup complete! Please log out and log back in for Docker group changes to take effect." 