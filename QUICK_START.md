# 🚀 DevOnNight - Quick Start Guide

## ⚡ Khởi động nhanh

### **Cách 1: Sử dụng script tự động (Khuyến nghị)**
```bash
# Khởi động backend
./start-backend.sh

# Trong terminal khác, khởi động frontend
cd frontend && npm run dev
```

### **Cách 2: Khởi động thủ công**
```bash
# 1. Fix port conflict (nếu cần)
./quick-fix.sh

# 2. Khởi động backend
cd backend && npm run dev

# 3. Khởi động frontend (terminal khác)
cd frontend && npm run dev
```

### **Cách 3: Khởi động toàn bộ hệ thống**
```bash
./fix-port-conflict.sh
```

## 🔧 Troubleshooting

### **Lỗi Port 5000 đã được sử dụng:**
```bash
./quick-fix.sh
```

### **Lỗi MongoDB không chạy:**
```bash
sudo docker run -d -p 27017:27017 --name mongodb mongo:6
```

### **Lỗi "Failed to fetch":**
1. Kiểm tra backend có chạy không: `curl http://localhost:5000/health`
2. Kiểm tra frontend có chạy không: `curl http://localhost:3000` hoặc `curl http://localhost:3001`
3. Kiểm tra CORS configuration

## 📋 Kiểm tra hệ thống

### **Test Backend:**
```bash
# Health check
curl http://localhost:5000/health

# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

### **Test Frontend:**
```bash
# Kiểm tra frontend
curl http://localhost:3000
# hoặc
curl http://localhost:3001
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:3000 (hoặc 3001)
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## 🛑 Dừng hệ thống

```bash
# Kill backend
pkill -f "nodemon"

# Kill frontend
pkill -f "next"

# Stop MongoDB
sudo docker stop mongodb
```

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Xem `TROUBLESHOOTING.md` để biết chi tiết
2. Xem `PORT_CONFLICT_FIX.md` nếu gặp lỗi port
3. Chạy `./check-errors.sh` để kiểm tra lỗi

---

**DevOnNight** - Where developers connect and collaborate! 🚀