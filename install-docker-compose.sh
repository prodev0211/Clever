#!/bin/bash

# DevOnNight - Docker Compose Installation Script
# This script installs Docker Compose V2

set -e

echo "🐳 Installing Docker Compose V2..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script needs to be run as root (use sudo)"
        exit 1
    fi
}

# Detect OS
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "Could not detect OS"
        exit 1
    fi
}

# Install Docker Compose V2 on Ubuntu/Debian
install_ubuntu_debian() {
    print_status "Installing Docker Compose V2 on Ubuntu/Debian..."
    
    # Update package list
    apt-get update
    
    # Install Docker Compose plugin
    apt-get install -y docker-compose-plugin
    
    # Verify installation
    if docker compose version &> /dev/null; then
        print_success "Docker Compose V2 installed successfully!"
        docker compose version
    else
        print_error "Failed to install Docker Compose V2"
        exit 1
    fi
}

# Install Docker Compose V2 on CentOS/RHEL
install_centos_rhel() {
    print_status "Installing Docker Compose V2 on CentOS/RHEL..."
    
    # Install EPEL repository
    yum install -y epel-release
    
    # Install Docker Compose plugin
    yum install -y docker-compose-plugin
    
    # Verify installation
    if docker compose version &> /dev/null; then
        print_success "Docker Compose V2 installed successfully!"
        docker compose version
    else
        print_error "Failed to install Docker Compose V2"
        exit 1
    fi
}

# Install Docker Compose V2 on macOS
install_macos() {
    print_status "Installing Docker Compose V2 on macOS..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        print_error "Homebrew is not installed. Please install Homebrew first."
        echo "Install Homebrew: https://brew.sh/"
        exit 1
    fi
    
    # Install Docker Compose V2
    brew install docker-compose
    
    # Verify installation
    if docker compose version &> /dev/null; then
        print_success "Docker Compose V2 installed successfully!"
        docker compose version
    else
        print_error "Failed to install Docker Compose V2"
        exit 1
    fi
}

# Manual installation
install_manual() {
    print_status "Installing Docker Compose V2 manually..."
    
    # Download Docker Compose V2
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    
    # Download and install
    curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Make executable
    chmod +x /usr/local/bin/docker-compose
    
    # Create symlink for docker compose
    ln -sf /usr/local/bin/docker-compose /usr/local/bin/docker-compose-v2
    
    # Verify installation
    if /usr/local/bin/docker-compose version &> /dev/null; then
        print_success "Docker Compose V2 installed successfully!"
        /usr/local/bin/docker-compose version
    else
        print_error "Failed to install Docker Compose V2"
        exit 1
    fi
}

# Main installation function
main() {
    echo "DevOnNight - Docker Compose V2 Installation"
    echo "============================================"
    echo ""
    
    # Check if running as root
    check_root
    
    # Detect OS
    detect_os
    print_status "Detected OS: $OS"
    
    # Install based on OS
    case $OS in
        *"Ubuntu"*|*"Debian"*)
            install_ubuntu_debian
            ;;
        *"CentOS"*|*"Red Hat"*|*"Rocky"*|*"AlmaLinux"*)
            install_centos_rhel
            ;;
        *"macOS"*)
            install_macos
            ;;
        *)
            print_warning "Unsupported OS: $OS"
            echo "Trying manual installation..."
            install_manual
            ;;
    esac
    
    echo ""
    print_success "Docker Compose V2 installation completed!"
    echo ""
    echo "🎉 You can now run:"
    echo "   ./start.sh"
    echo ""
    echo "Or use Docker Compose directly:"
    echo "   docker compose up -d"
}

# Run main function
main "$@"