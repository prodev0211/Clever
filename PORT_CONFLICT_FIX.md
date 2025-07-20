# 🚨 Port Conflict Fix - DevOnNight

## Lỗi: `EADDRINUSE: address already in use :::5000`

### 🔧 Giải pháp nhanh:

#### **Cách 1: Sử dụng script tự động**
```bash
./quick-fix.sh
```

#### **Cách 2: Thủ công**
```bash
# 1. Tìm process đang sử dụng port 5000
ss -tulpn | grep :5000

# 2. Kill process (thay <PID> bằng PID thực tế)
kill -9 <PID>

# 3. Khởi động lại backend
cd backend && npm run dev
```

#### **Cách 3: Sử dụng script đầy đủ**
```bash
./fix-port-conflict.sh
```

### 📋 Các port thường gặp conflict:

- **Port 5000**: Backend API
- **Port 3000**: Frontend (Next.js)
- **Port 3001**: Frontend alternative
- **Port 27017**: MongoDB

### 🔍 Kiểm tra port đang sử dụng:

```bash
# Kiểm tra tất cả port
ss -tulpn | grep -E ":(3000|3001|5000|27017)"

# Hoặc kiểm tra từng port
ss -tulpn | grep :5000
ss -tulpn | grep :3000
ss -tulpn | grep :3001
```

### 🛠️ Script tự động:

#### **quick-fix.sh** - Fix nhanh port 5000
```bash
#!/bin/bash
# Kill process trên port 5000 và khởi động backend
```

#### **fix-port-conflict.sh** - Fix tất cả port conflicts
```bash
#!/bin/bash
# Kill tất cả process, khởi động MongoDB, Backend, Frontend
```

### ✅ Kết quả mong đợi:

Sau khi chạy script, bạn sẽ thấy:
```
🔧 Quick Fix - Port 5000 Conflict
==================================
1. Checking port 5000...
Found process 41336 using port 5000
Killing process 41336...
✅ Port 5000 freed

2. Starting Backend...
🚀 DevOnNight Backend running on port 5000
📡 Socket.IO server ready
🌍 Environment: development
Redis Connected
MongoDB Connected: localhost

✅ Backend should now be running on port 5000
```

### 🎯 Test sau khi fix:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test register endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

---

**DevOnNight** - Where developers connect and collaborate! 🚀