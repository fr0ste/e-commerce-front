#!/bin/bash

# EC2 Setup Script for E-commerce Frontend using Docker Hub
# This script installs Docker and Docker Compose on a fresh EC2 instance
# Backend is expected to be running on a separate instance

set -e

echo "🔧 Setting up EC2 instance for E-commerce Frontend (Docker Hub version)..."

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
sudo yum update -y || sudo apt-get update -y

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

# Set up environment file
print_status "Setting up environment configuration..."
if [ -f "env.example" ]; then
    cp env.example /opt/ecommerce/.env
    print_warning "Please edit /opt/ecommerce/.env with your production values"
    print_warning "Make sure to configure BACKEND_HOST and BACKEND_PORT"
fi

# Copy only necessary files for frontend deployment
print_status "Setting up deployment files..."
if [ -f "docker-compose.prod-hub.yml" ]; then
    cp docker-compose.prod-hub.yml /opt/ecommerce/
fi

if [ -f "deploy-hub.sh" ]; then
    cp deploy-hub.sh /opt/ecommerce/
    chmod +x /opt/ecommerce/deploy-hub.sh
fi

if [ -d "nginx" ]; then
    cp -r nginx /opt/ecommerce/
fi

# Create systemd service for auto-start (optional)
print_status "Creating systemd service for auto-start..."
sudo tee /etc/systemd/system/ecommerce-frontend.service > /dev/null <<EOF
[Unit]
Description=E-commerce Frontend Application (Docker Hub)
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/ecommerce
ExecStart=/opt/ecommerce/deploy-hub.sh
ExecStop=/usr/local/bin/docker-compose -f /opt/ecommerce/docker-compose.prod-hub.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
sudo systemctl enable ecommerce-frontend.service

print_status "🎉 EC2 setup completed successfully!"
print_status "Next steps:"
echo "  1. Edit /opt/ecommerce/.env with your production values"
echo "  2. Configure BACKEND_HOST and BACKEND_PORT in .env"
echo "  3. Navigate to /opt/ecommerce directory"
echo "  4. Run: ./deploy-hub.sh"
echo "  5. Or start the service: sudo systemctl start ecommerce-frontend"

# Show Docker version
print_status "Docker version:"
docker --version
docker-compose --version

print_status "Setup complete! Please log out and log back in for Docker group changes to take effect."
print_status "Note: This setup is for frontend only. Backend should be running on a separate instance."
print_warning "Make sure your backend instance is accessible and properly configured." 