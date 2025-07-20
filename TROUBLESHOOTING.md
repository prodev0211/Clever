# 🔧 Troubleshooting Guide - DevOnNight

## 🚨 Lỗi "Failed to Fetch" khi đăng ký

### Nguyên nhân và giải pháp:

#### 1. **Backend không chạy**
```bash
# Kiểm tra backend có chạy không
curl http://localhost:5000/health

# Nếu không chạy, khởi động lại
cd backend && npm run dev
```

#### 2. **MongoDB không chạy**
```bash
# Khởi động MongoDB bằng Docker
sudo docker run -d -p 27017:27017 --name mongodb mongo:6

# Hoặc bằng systemctl (nếu có)
sudo systemctl start mongod
```

#### 3. **CORS Issues**
- Backend đã được cấu hình để cho phép cả port 3000 và 3001
- Nếu frontend chạy trên port khác, thêm vào CORS config

#### 4. **Port Conflicts**
```bash
# Kiểm tra port đang sử dụng
lsof -i :3000
lsof -i :3001
lsof -i :5000

# Kill process nếu cần
kill -9 <PID>
```

#### 5. **Environment Variables**
```bash
# Kiểm tra .env.local trong frontend
cat frontend/.env.local

# Nếu không có, tạo file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > frontend/.env.local
echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:5000" >> frontend/.env.local
```

### 🔍 Debug Steps:

#### Step 1: Kiểm tra Backend
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test register endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

#### Step 2: Kiểm tra Frontend
```bash
# Kiểm tra frontend có chạy không
curl http://localhost:3000
# hoặc
curl http://localhost:3001
```

#### Step 3: Kiểm tra Database
```bash
# Kiểm tra MongoDB
sudo docker ps | grep mongo

# Nếu không có, khởi động
sudo docker run -d -p 27017:27017 --name mongodb mongo:6
```

#### Step 4: Kiểm tra Logs
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd frontend && npm run dev
```

### 🛠️ Quick Fix Script:

```bash
#!/bin/bash

echo "🔧 DevOnNight Quick Fix"
echo "========================"

# 1. Stop all processes
echo "1. Stopping all processes..."
pkill -f "nodemon"
pkill -f "next"

# 2. Start MongoDB
echo "2. Starting MongoDB..."
sudo docker stop mongodb 2>/dev/null
sudo docker rm mongodb 2>/dev/null
sudo docker run -d -p 27017:27017 --name mongodb mongo:6

# 3. Wait for MongoDB
echo "3. Waiting for MongoDB..."
sleep 5

# 4. Start Backend
echo "4. Starting Backend..."
cd backend && npm run dev &
sleep 3

# 5. Start Frontend
echo "5. Starting Frontend..."
cd frontend && npm run dev &

echo "✅ All services started!"
echo "🌐 Frontend: http://localhost:3000 (or 3001)"
echo "🔧 Backend: http://localhost:5000"
```

### 📋 Checklist:

- [ ] Backend chạy trên port 5000
- [ ] Frontend chạy trên port 3000 hoặc 3001
- [ ] MongoDB chạy trên port 27017
- [ ] CORS được cấu hình đúng
- [ ] Environment variables được set
- [ ] Không có port conflicts
- [ ] Database connection OK
- [ ] API endpoints trả về 200/201

### 🎯 Kết quả mong đợi:

Khi test API register thành công:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "discriminator": "2600",
    "avatar": null,
    "isEmailVerified": true
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### 📞 Hỗ trợ thêm:

Nếu vẫn gặp vấn đề:

1. **Kiểm tra console browser** (F12) để xem lỗi chi tiết
2. **Kiểm tra Network tab** để xem request/response
3. **Kiểm tra backend logs** để xem lỗi server
4. **Test API trực tiếp** bằng curl hoặc Postman

---

**DevOnNight** - Where developers connect and collaborate! 🚀