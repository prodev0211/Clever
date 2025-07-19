#!/bin/bash

echo "🚀 Starting DevOnNight..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start MongoDB and Redis with Docker Compose
echo "📦 Starting MongoDB and Redis..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Failed to start services. Please check Docker logs."
    exit 1
fi

echo "✅ Services started successfully!"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

# Start backend
echo "🔧 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Check if .env.local exists, if not create it
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
    echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:5000" >> .env.local
fi

# Start frontend
echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 DevOnNight is starting up!"
echo ""
echo "📊 Services:"
echo "   • MongoDB: http://localhost:27017"
echo "   • Redis: http://localhost:6379"
echo "   • MongoDB Express: http://localhost:8081 (admin/password)"
echo "   • Backend API: http://localhost:5000"
echo "   • Frontend: http://localhost:3000"
echo ""
echo "🔑 MongoDB Express credentials:"
echo "   • Username: admin"
echo "   • Password: password"
echo ""
echo "⏹️  To stop the application, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping DevOnNight..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    docker-compose down
    echo "✅ DevOnNight stopped."
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for processes
wait