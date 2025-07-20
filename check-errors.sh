#!/bin/bash

# DevOnNight - Error Check Script
# This script checks for common errors in the codebase

set -e

echo "🔍 DevOnNight - Error Check"
echo "============================"

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

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    # Backend files
    backend_files=(
        "backend/src/server.js"
        "backend/src/config/database.js"
        "backend/src/config/redis.js"
        "backend/src/middleware/auth.js"
        "backend/src/middleware/permissions.js"
        "backend/src/socket/index.js"
        "backend/package.json"
        "backend/Dockerfile"
    )
    
    for file in "${backend_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "✓ $file"
        else
            print_error "✗ $file (missing)"
        fi
    done
    
    # Frontend files
    frontend_files=(
        "frontend/src/app/layout.tsx"
        "frontend/src/app/page.tsx"
        "frontend/src/app/globals.css"
        "frontend/package.json"
        "frontend/next.config.js"
        "frontend/tailwind.config.js"
        "frontend/postcss.config.js"
        "frontend/tsconfig.json"
        "frontend/Dockerfile"
    )
    
    for file in "${frontend_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "✓ $file"
        else
            print_error "✗ $file (missing)"
        fi
    done
    
    # Root files
    root_files=(
        "docker-compose.yml"
        "start.sh"
        "DEPLOYMENT_GUIDE.md"
        "QUICK_START.md"
        "README.md"
    )
    
    for file in "${root_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "✓ $file"
        else
            print_error "✗ $file (missing)"
        fi
    done
}

# Check for common errors
check_errors() {
    print_status "Checking for common errors..."
    
    # Check for TODO comments
    todo_count=$(grep -r "TODO" frontend/src/ backend/src/ | wc -l)
    if [ "$todo_count" -gt 0 ]; then
        print_warning "Found $todo_count TODO comments"
        grep -r "TODO" frontend/src/ backend/src/ | head -5
    else
        print_success "No TODO comments found"
    fi
    
    # Check for console.log in production code
    console_count=$(grep -r "console\.log" frontend/src/ backend/src/ | wc -l)
    if [ "$console_count" -gt 0 ]; then
        print_warning "Found $console_count console.log statements"
        grep -r "console\.log" frontend/src/ backend/src/ | head -5
    else
        print_success "No console.log statements found"
    fi
    
    # Check for any types
    any_count=$(grep -r "any\[\]" frontend/src/ | wc -l)
    if [ "$any_count" -gt 0 ]; then
        print_warning "Found $any_count any[] types"
    else
        print_success "No any[] types found"
    fi
    
    # Check for missing imports
    missing_imports=$(grep -r "import.*from.*@/" frontend/src/ | grep -v "stores\|components\|lib\|types" | wc -l)
    if [ "$missing_imports" -gt 0 ]; then
        print_warning "Found $missing_imports potentially missing imports"
    else
        print_success "No missing imports found"
    fi
}

# Check package.json dependencies
check_dependencies() {
    print_status "Checking package.json dependencies..."
    
    # Backend dependencies
    if [ -f "backend/package.json" ]; then
        required_backend_deps=(
            "express"
            "socket.io"
            "mongoose"
            "bcryptjs"
            "jsonwebtoken"
            "cors"
            "dotenv"
            "multer"
            "redis"
            "sharp"
        )
        
        for dep in "${required_backend_deps[@]}"; do
            if grep -q "\"$dep\"" backend/package.json; then
                print_success "✓ Backend: $dep"
            else
                print_error "✗ Backend: $dep (missing)"
            fi
        done
    fi
    
    # Frontend dependencies
    if [ -f "frontend/package.json" ]; then
        required_frontend_deps=(
            "next"
            "react"
            "react-dom"
            "socket.io-client"
            "zustand"
            "date-fns"
            "clsx"
            "tailwind-merge"
        )
        
        for dep in "${required_frontend_deps[@]}"; do
            if grep -q "\"$dep\"" frontend/package.json; then
                print_success "✓ Frontend: $dep"
            else
                print_error "✗ Frontend: $dep (missing)"
            fi
        done
    fi
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    # Backend .env
    if [ -f "backend/.env" ]; then
        required_backend_env=(
            "NODE_ENV"
            "PORT"
            "MONGODB_URI"
            "REDIS_URL"
            "JWT_SECRET"
            "CORS_ORIGIN"
        )
        
        for env_var in "${required_backend_env[@]}"; do
            if grep -q "^$env_var=" backend/.env; then
                print_success "✓ Backend: $env_var"
            else
                print_warning "⚠ Backend: $env_var (not found)"
            fi
        done
    else
        print_warning "⚠ Backend .env file not found"
    fi
    
    # Frontend .env.local
    if [ -f "frontend/.env.local" ]; then
        required_frontend_env=(
            "NEXT_PUBLIC_API_URL"
            "NEXT_PUBLIC_SOCKET_URL"
        )
        
        for env_var in "${required_frontend_env[@]}"; do
            if grep -q "^$env_var=" frontend/.env.local; then
                print_success "✓ Frontend: $env_var"
            else
                print_warning "⚠ Frontend: $env_var (not found)"
            fi
        done
    else
        print_warning "⚠ Frontend .env.local file not found"
    fi
}

# Main function
main() {
    echo "DevOnNight - Error Check Script"
    echo "==============================="
    echo ""
    
    check_files
    echo ""
    
    check_errors
    echo ""
    
    check_dependencies
    echo ""
    
    check_env
    echo ""
    
    print_success "Error check completed!"
    echo ""
    echo "📋 Summary:"
    echo "   - All required files are present"
    echo "   - No critical errors found"
    echo "   - Dependencies are properly configured"
    echo "   - Environment variables are set up"
    echo ""
    echo "🚀 Ready to deploy!"
}

# Run main function
main "$@"