#!/bin/bash

echo "🔍 Debug Guilds API"
echo "=================="

# 1. Check backend
echo "1. Checking backend..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running"
    exit 1
fi

# 2. Register test user
echo ""
echo "2. Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"debuguser","email":"debug@example.com","password":"password123"}')

echo "Register response: $REGISTER_RESPONSE"

# 3. Extract token
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ No token received"
    exit 1
fi

echo "✅ Token extracted"

# 4. Test guilds API
echo ""
echo "3. Testing guilds API..."
GUILDS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/guilds)

echo "Guilds response: $GUILDS_RESPONSE"

if echo "$GUILDS_RESPONSE" | grep -q "guilds"; then
    echo "✅ Guilds API working"
else
    echo "❌ Guilds API failed"
fi

# 5. Test without token
echo ""
echo "4. Testing guilds API without token (should fail)..."
NO_TOKEN_RESPONSE=$(curl -s http://localhost:5000/api/guilds)
echo "Response without token: $NO_TOKEN_RESPONSE"

if echo "$NO_TOKEN_RESPONSE" | grep -q "Access denied"; then
    echo "✅ Authentication working correctly"
else
    echo "⚠️  Authentication might not be working"
fi

echo ""
echo "🎉 Debug completed!"
echo ""
echo "📋 Next steps:"
echo "1. Check if user is logged in in frontend"
echo "2. Check localStorage for accessToken"
echo "3. Check browser console for errors"
echo "4. Check Network tab for failed requests"