#!/bin/bash

echo "🔧 Quick Fix - Port 5000 Conflict"
echo "=================================="

# Kill process on port 5000
echo "1. Checking port 5000..."
PID=$(ss -tulpn | grep ":5000 " | awk '{print $6}' | sed 's/.*pid=\([0-9]*\).*/\1/')

if [ ! -z "$PID" ]; then
    echo "Found process $PID using port 5000"
    echo "Killing process $PID..."
    kill -9 $PID
    sleep 2
    echo "✅ Port 5000 freed"
else
    echo "✅ Port 5000 is available"
fi

echo ""
echo "2. Starting Backend..."
cd backend && npm run dev

echo ""
echo "✅ Backend should now be running on port 5000"