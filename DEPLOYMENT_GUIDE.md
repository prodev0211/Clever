# 🚀 DevOnNight - Deployment Guide

Hướng dẫn chi tiết để chạy và deploy ứng dụng DevOnNight Discord-like chat.

## 📋 Prerequisites

### Yêu cầu hệ thống:
- **Node.js** 18+ 
- **npm** hoặc **yarn**
- **MongoDB** 5+
- **Redis** 6+
- **Git**

### Cài đặt Node.js:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node@18

# Windows
# Tải từ https://nodejs.org/
```

### Cài đặt MongoDB:
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community

# Windows
# Tải từ https://www.mongodb.com/try/download/community
```

### Cài đặt Redis:
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# macOS
brew install redis
brew services start redis

# Windows
# Tải từ https://redis.io/download
```

## 🏃‍♂️ Local Development

### 1. Clone Repository
```bash
git clone <repository-url>
cd devonnight
```

### 2. Cài đặt Dependencies
```bash
# Cài đặt dependencies cho root project
npm install

# Cài đặt dependencies cho backend
cd backend
npm install

# Cài đặt dependencies cho frontend
cd ../frontend
npm install
```

### 3. Cấu hình Environment Variables

#### Backend (.env)
Tạo file `backend/.env`:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/devonnight
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# CORS
CORS_ORIGIN=http://localhost:3000
SOCKET_CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
UPLOAD_PATH=../uploads
MAX_FILE_SIZE=10485760

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Frontend (.env.local)
Tạo file `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Khởi động Development Servers

#### Option 1: Sử dụng script từ root
```bash
# Từ thư mục root
npm run dev
```

#### Option 2: Khởi động riêng lẻ
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 5. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🚀 Production Deployment

### Option 1: Docker Deployment

#### 1. Tạo Dockerfile cho Backend
Tạo file `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### 2. Tạo Dockerfile cho Frontend
Tạo file `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

#### 3. Docker Compose
Tạo file `docker-compose.yml`:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/devonnight?authSource=admin
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-production-jwt-secret
      - CORS_ORIGIN=http://localhost:3000
    depends_on:
      - mongodb
      - redis
    volumes:
      - uploads_data:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
      - NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
    depends_on:
      - backend

volumes:
  mongodb_data:
  redis_data:
  uploads_data:
```

#### 4. Deploy với Docker
```bash
# Build và chạy
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng
docker-compose down
```

### Option 2: Manual Deployment

#### 1. Build Production
```bash
# Build backend
cd backend
npm install --production
npm run build

# Build frontend
cd ../frontend
npm install --production
npm run build
```

#### 2. Cấu hình Production Environment
```env
# Backend production .env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-url
REDIS_URL=redis://your-redis-url
JWT_SECRET=your-production-secret
CORS_ORIGIN=https://your-domain.com
```

#### 3. Sử dụng PM2 (Recommended)
```bash
# Cài đặt PM2
npm install -g pm2

# Khởi động backend
cd backend
pm2 start src/server.js --name "devonnight-backend"

# Khởi động frontend
cd ../frontend
pm2 start npm --name "devonnight-frontend" -- start

# Lưu cấu hình PM2
pm2 save
pm2 startup
```

### Option 3: Cloud Deployment

#### Vercel (Frontend)
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

#### Railway/Render (Backend)
```bash
# Kết nối repository với Railway/Render
# Cấu hình environment variables
# Deploy tự động
```

## 🔧 Troubleshooting

### Lỗi thường gặp:

#### 1. MongoDB Connection Error
```bash
# Kiểm tra MongoDB service
sudo systemctl status mongod

# Khởi động MongoDB
sudo systemctl start mongod
```

#### 2. Redis Connection Error
```bash
# Kiểm tra Redis service
sudo systemctl status redis-server

# Khởi động Redis
sudo systemctl start redis-server
```

#### 3. Port Already in Use
```bash
# Tìm process sử dụng port
lsof -i :5000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### 4. Node Modules Issues
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

#### 5. Build Errors
```bash
# Clear cache
npm run build -- --no-cache

# Kiểm tra TypeScript errors
npx tsc --noEmit
```

## 📊 Monitoring

### Health Checks
```bash
# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost:3000
```

### Logs
```bash
# Backend logs
pm2 logs devonnight-backend

# Frontend logs
pm2 logs devonnight-frontend

# Docker logs
docker-compose logs -f
```

## 🔒 Security Checklist

- [ ] Thay đổi JWT secrets
- [ ] Cấu hình CORS đúng domain
- [ ] Bật HTTPS cho production
- [ ] Cấu hình rate limiting
- [ ] Bật helmet security headers
- [ ] Cấu hình MongoDB authentication
- [ ] Backup database thường xuyên

## 📈 Performance Optimization

### Backend:
- Sử dụng Redis caching
- Implement database indexing
- Optimize queries
- Use compression middleware

### Frontend:
- Enable Next.js optimization
- Use image optimization
- Implement code splitting
- Enable gzip compression

## 🆘 Support

Nếu gặp vấn đề:
1. Kiểm tra logs
2. Xem troubleshooting section
3. Tạo issue trên GitHub
4. Liên hệ team support

---

**DevOnNight** - Where developers connect and collaborate! 🚀