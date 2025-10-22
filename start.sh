#!/bin/bash

# DevOnNight - Quick Start Script
# This script helps you start the DevOnNight application

set -e

echo "🚀 DevOnNight - Starting Application..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    print_success "Docker is installed"
}

# Check if Docker Compose is available (try both V1 and V2)
check_docker_compose() {
    # Try Docker Compose V2 first
    if docker compose version &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker compose"
        print_success "Docker Compose V2 is available"
        return 0
    fi
    
    # Try Docker Compose V1
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker-compose"
        print_success "Docker Compose V1 is available"
        return 0
    fi
    
    print_error "Docker Compose is not available. Please install Docker Compose."
    echo ""
    echo "Installation options:"
    echo "1. Install Docker Desktop (includes Docker Compose V2)"
    echo "2. Install Docker Compose V2: sudo apt-get install docker-compose-plugin"
    echo "3. Install Docker Compose V1: sudo apt-get install docker-compose"
    exit 1
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    if [ -f "package.json" ]; then
        npm install
    fi
    
    # Install backend dependencies
    if [ -d "backend" ] && [ -f "backend/package.json" ]; then
        cd backend
        npm install
        cd ..
    fi
    
    # Install frontend dependencies
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        cd frontend
        npm install
        cd ..
    fi
    
    print_success "Dependencies installed successfully"
}

# Create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
# Server Configuration
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/devonnight
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# CORS
CORS_ORIGIN=http://localhost:3000
SOCKET_CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
EOF
        print_success "Created backend/.env"
    fi
    
    # Frontend .env.local
    if [ ! -f "frontend/.env.local" ]; then
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
EOF
        print_success "Created frontend/.env.local"
    fi
}

# Start with Docker
start_docker() {
    print_status "Starting with Docker..."
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found!"
        exit 1
    fi
    
    # Build and start containers
    print_status "Building and starting containers..."
    $DOCKER_COMPOSE_CMD up -d --build
    
    if [ $? -eq 0 ]; then
        print_success "Application started with Docker!"
        echo ""
        echo "🌐 Access your application:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend API: http://localhost:5000"
        echo "   Health Check: http://localhost:5000/health"
        echo ""
        echo "📊 View logs: $DOCKER_COMPOSE_CMD logs -f"
        echo "🛑 Stop: $DOCKER_COMPOSE_CMD down"
    else
        print_error "Failed to start Docker containers"
        echo ""
        echo "Trying alternative method..."
        start_local
    fi
}

# Start with local development
start_local() {
    print_status "Starting with local development..."
    
    # Check if MongoDB is running
    if ! pgrep -x "mongod" > /dev/null; then
        print_warning "MongoDB is not running. Please start MongoDB first."
        echo "   Ubuntu/Debian: sudo systemctl start mongod"
        echo "   macOS: brew services start mongodb/brew/mongodb-community"
        echo "   Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:6"
    fi
    
    # Check if Redis is running
    if ! pgrep -x "redis-server" > /dev/null; then
        print_warning "Redis is not running. Please start Redis first."
        echo "   Ubuntu/Debian: sudo systemctl start redis-server"
        echo "   macOS: brew services start redis"
        echo "   Or use Docker: docker run -d -p 6379:6379 --name redis redis:7-alpine"
    fi
    
    # Start backend
    print_status "Starting backend..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a bit for backend to start
    sleep 3
    
    # Start frontend
    print_status "Starting frontend..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Application started locally!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5000"
    echo ""
    echo "🛑 Press Ctrl+C to stop"
    
    # Wait for user to stop
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" INT
    wait
}

# Start with Docker Compose V2 fallback
start_docker_fallback() {
    print_status "Trying Docker Compose V2..."
    
    if docker compose version &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker compose"
        start_docker
    else
        print_error "Docker Compose V2 not available"
        start_local
    fi
}

# Main script
main() {
    echo "DevOnNight - Discord-like Chat Application"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    check_docker
    check_docker_compose
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Create environment files
    create_env_files
    
    # Ask user for deployment method
    echo ""
    echo "Choose deployment method:"
    echo "1. Docker (Recommended for production)"
    echo "2. Local Development"
    echo "3. Docker with fallback to local"
    echo ""
    read -p "Enter your choice (1, 2, or 3): " choice
    
    case $choice in
        1)
            start_docker
            ;;
        2)
            start_local
            ;;
        3)
            start_docker_fallback
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
}

# Run main function
main "$@"