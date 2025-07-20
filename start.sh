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
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
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
    
    # Build and start containers
    docker-compose up -d --build
    
    print_success "Application started with Docker!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5000"
    echo "   Health Check: http://localhost:5000/health"
    echo ""
    echo "📊 View logs: docker-compose logs -f"
    echo "🛑 Stop: docker-compose down"
}

# Start with local development
start_local() {
    print_status "Starting with local development..."
    
    # Check if MongoDB is running
    if ! pgrep -x "mongod" > /dev/null; then
        print_warning "MongoDB is not running. Please start MongoDB first."
        echo "   Ubuntu/Debian: sudo systemctl start mongod"
        echo "   macOS: brew services start mongodb/brew/mongodb-community"
    fi
    
    # Check if Redis is running
    if ! pgrep -x "redis-server" > /dev/null; then
        print_warning "Redis is not running. Please start Redis first."
        echo "   Ubuntu/Debian: sudo systemctl start redis-server"
        echo "   macOS: brew services start redis"
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

# Main script
main() {
    echo "DevOnNight - Discord-like Chat Application"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    check_docker
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
    echo ""
    read -p "Enter your choice (1 or 2): " choice
    
    case $choice in
        1)
            start_docker
            ;;
        2)
            start_local
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
}

# Run main function
main "$@"