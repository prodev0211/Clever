# 🔍 Debug "Failed to fetch guilds" Error

## 🚨 Vấn đề: "Error loading guilds: Failed to fetch guilds"

### 🔍 Nguyên nhân có thể:

1. **User chưa đăng nhập**
2. **Token không hợp lệ hoặc hết hạn**
3. **CORS issues**
4. **API endpoint không đúng**
5. **Backend không chạy**

### 🔧 Giải pháp từng bước:

#### **Step 1: Kiểm tra Backend**
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test guilds API (sẽ trả về lỗi auth)
curl http://localhost:5000/api/guilds
```

#### **Step 2: Kiểm tra Authentication**
```bash
# 1. Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# 2. Test guilds với token
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/guilds
```

#### **Step 3: Kiểm tra Frontend**

1. **Mở Developer Tools** (F12)
2. **Kiểm tra Console** để xem lỗi chi tiết
3. **Kiểm tra Network tab** để xem request/response
4. **Kiểm tra Application tab** để xem localStorage

#### **Step 4: Debug Frontend Authentication**

```javascript
// Trong browser console
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('User:', localStorage.getItem('user'));
console.log('Is Authenticated:', api.isAuthenticated());
```

#### **Step 5: Test API từ Frontend**

```javascript
// Trong browser console
api.getGuilds().then(response => {
  console.log('Guilds:', response);
}).catch(error => {
  console.error('Error:', error);
});
```

### 🛠️ Script Debug Tự động:

```bash
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
echo "3. Testing guilds API..."
GUILDS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/guilds)

echo "Guilds response: $GUILDS_RESPONSE"

if echo "$GUILDS_RESPONSE" | grep -q "guilds"; then
    echo "✅ Guilds API working"
else
    echo "❌ Guilds API failed"
fi
```

### 📋 Checklist Debug:

- [ ] Backend chạy trên port 5000
- [ ] User đã đăng nhập trong frontend
- [ ] Token có trong localStorage
- [ ] Token không hết hạn
- [ ] CORS được cấu hình đúng
- [ ] API endpoint đúng (`/api/guilds`)
- [ ] Authorization header được gửi đúng

### 🎯 Kết quả mong đợi:

#### **Backend API Test:**
```json
{
  "guilds": []
}
```

#### **Frontend Console:**
```javascript
// Không có lỗi
// Guilds: { guilds: [] }
```

### 🔧 Fix thường gặp:

#### **1. User chưa đăng nhập:**
```javascript
// Đăng nhập trước khi fetch guilds
await api.login({ email: 'user@example.com', password: 'password' });
```

#### **2. Token hết hạn:**
```javascript
// Refresh token
await api.refreshToken();
```

#### **3. CORS issues:**
```javascript
// Kiểm tra CORS config trong backend
// Đảm bảo frontend URL được cho phép
```

#### **4. API endpoint sai:**
```javascript
// Đảm bảo sử dụng đúng endpoint
api.getGuilds() // ✅ Đúng
api.get('/guilds') // ❌ Sai
```

### 📞 Hỗ trợ thêm:

Nếu vẫn gặp vấn đề:

1. **Kiểm tra browser console** để xem lỗi chi tiết
2. **Kiểm tra Network tab** để xem request/response
3. **Test API trực tiếp** bằng curl hoặc Postman
4. **Kiểm tra backend logs** để xem lỗi server

---

**DevOnNight** - Where developers connect and collaborate! 🚀