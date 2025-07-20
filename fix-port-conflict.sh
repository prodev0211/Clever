#!/bin/bash

echo "🔧 DevOnNight - Fix Port Conflicts"
echo "=================================="

# Function to kill process on port
kill_port() {
    local port=$1
    echo "Checking port $port..."
    
    # Find process using the port
    local pid=$(ss -tulpn | grep ":$port " | awk '{print $6}' | sed 's/.*pid=\([0-9]*\).*/\1/')
    
    if [ ! -z "$pid" ]; then
        echo "Found process $pid using port $port"
        echo "Killing process $pid..."
        kill -9 $pid
        sleep 2
        echo "✅ Port $port freed"
    else
        echo "✅ Port $port is available"
    fi
}

# Kill processes on common ports
echo "1. Checking and freeing ports..."
kill_port 5000  # Backend
kill_port 3000  # Frontend
kill_port 3001  # Frontend alternative
kill_port 27017 # MongoDB

echo ""
echo "2. Starting MongoDB..."
sudo docker stop mongodb 2>/dev/null
sudo docker rm mongodb 2>/dev/null
sudo docker run -d -p 27017:27017 --name mongodb mongo:6

echo ""
echo "3. Waiting for MongoDB to start..."
sleep 5

echo ""
echo "4. Starting Backend..."
cd backend && npm run dev &
BACKEND_PID=$!

echo "Backend started with PID: $BACKEND_PID"
sleep 3

echo ""
echo "5. Starting Frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "Frontend started with PID: $FRONTEND_PID"

echo ""
echo "✅ All services started successfully!"
echo "🌐 Frontend: http://localhost:3000 (or 3001)"
echo "🔧 Backend: http://localhost:5000"
echo "🗄️  MongoDB: localhost:27017"

echo ""
echo "📋 Process PIDs:"
echo "   Backend: $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"

echo ""
echo "🛑 To stop all services:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   sudo docker stop mongodb"