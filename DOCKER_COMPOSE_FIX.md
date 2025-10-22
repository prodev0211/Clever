# 🔧 Docker Compose Fix Guide

## 🚨 Lỗi Docker Compose

Nếu bạn gặp lỗi:
```
ModuleNotFoundError: No module named 'distutils'
```

Đây là lỗi do Docker Compose V1 không tương thích với Python 3.12.

## 🛠️ Giải pháp

### Option 1: Cài đặt Docker Compose V2 (Khuyến nghị)

```bash
# Chạy script cài đặt tự động
chmod +x install-docker-compose.sh
sudo ./install-docker-compose.sh
```

### Option 2: Cài đặt thủ công

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

#### CentOS/RHEL:
```bash
sudo yum install -y epel-release
sudo yum install -y docker-compose-plugin
```

#### macOS:
```bash
brew install docker-compose
```

### Option 3: Sử dụng Local Development

Nếu không muốn cài đặt Docker Compose V2, bạn có thể chạy ứng dụng bằng local development:

```bash
# Chạy script và chọn option 2
./start.sh
# Chọn: 2. Local Development
```

## 🔍 Kiểm tra cài đặt

Sau khi cài đặt, kiểm tra:

```bash
# Kiểm tra Docker Compose V2
docker compose version

# Hoặc kiểm tra Docker Compose V1
docker-compose --version
```

## 🚀 Chạy ứng dụng

Sau khi cài đặt Docker Compose V2:

```bash
# Chạy script khởi động
./start.sh
# Chọn: 1. Docker (Recommended for production)
```

## 📋 Troubleshooting

### Lỗi "Permission denied"
```bash
sudo usermod -aG docker $USER
# Logout và login lại
```

### Lỗi "Docker daemon not running"
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Lỗi "Port already in use"
```bash
# Tìm process sử dụng port
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

## 🎯 Kết quả mong đợi

Sau khi cài đặt thành công:

```
[SUCCESS] Docker Compose V2 installed successfully!
Docker Compose version v2.20.0
```

Và có thể chạy:

```bash
docker compose up -d
```

## 📞 Hỗ trợ

Nếu vẫn gặp vấn đề:

1. Kiểm tra phiên bản Docker: `docker --version`
2. Kiểm tra phiên bản Docker Compose: `docker compose version`
3. Thử chạy local development thay vì Docker
4. Tạo issue trên GitHub với thông tin lỗi chi tiết

---

**DevOnNight** - Where developers connect and collaborate! 🚀