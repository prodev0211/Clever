#!/bin/bash

echo "🚀 DevOnNight - Starting Backend"
echo "================================"

# Check if port 5000 is in use
echo "1. Checking port 5000..."
if ss -tulpn | grep -q ":5000 "; then
    echo "⚠️  Port 5000 is in use. Killing existing process..."
    PID=$(ss -tulpn | grep ":5000 " | awk '{print $6}' | sed 's/.*pid=\([0-9]*\).*/\1/')
    kill -9 $PID
    sleep 2
    echo "✅ Port 5000 freed"
else
    echo "✅ Port 5000 is available"
fi

# Check if MongoDB is running
echo ""
echo "2. Checking MongoDB..."
if ! sudo docker ps | grep -q mongodb; then
    echo "⚠️  MongoDB not running. Starting MongoDB..."
    sudo docker stop mongodb 2>/dev/null
    sudo docker rm mongodb 2>/dev/null
    sudo docker run -d -p 27017:27017 --name mongodb mongo:6
    sleep 5
    echo "✅ MongoDB started"
else
    echo "✅ MongoDB is running"
fi

# Start backend
echo ""
echo "3. Starting Backend..."
cd backend && npm run dev

echo ""
echo "✅ Backend should now be running on http://localhost:5000"