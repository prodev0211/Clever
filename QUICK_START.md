# 🚀 DevOnNight - Quick Start

## ⚡ Chạy nhanh (5 phút)

### 1. Clone và cài đặt
```bash
git clone <repository-url>
cd devonnight
chmod +x start.sh
./start.sh
```

### 2. Hoặc chạy thủ công

#### Cài đặt dependencies:
```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

#### Tạo file môi trường:
```bash
# Backend (.env)
cp backend/.env.example backend/.env

# Frontend (.env.local)  
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > frontend/.env.local
echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:5000" >> frontend/.env.local
```

#### Khởi động:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend  
npm run dev
```

### 3. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🐳 Docker (Khuyến nghị)

```bash
# Build và chạy
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng
docker-compose down
```

## 📋 Yêu cầu hệ thống

- **Node.js** 18+
- **npm** hoặc **yarn**
- **MongoDB** 5+
- **Redis** 6+
- **Docker** (tùy chọn)

## 🔧 Troubleshooting

### Lỗi thường gặp:

**MongoDB không kết nối được:**
```bash
sudo systemctl start mongod
```

**Redis không kết nối được:**
```bash
sudo systemctl start redis-server
```

**Port đã được sử dụng:**
```bash
lsof -i :5000
kill -9 <PID>
```

**Dependencies lỗi:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📖 Tài liệu chi tiết

Xem file `DEPLOYMENT_GUIDE.md` để biết hướng dẫn chi tiết về:
- Cài đặt từng bước
- Cấu hình production
- Deploy lên cloud
- Monitoring và security

## 🆘 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs
2. Xem troubleshooting section
3. Tạo issue trên GitHub

---

**DevOnNight** - Where developers connect and collaborate! 🚀