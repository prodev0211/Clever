# 🔍 Frontend Debug Guide - Guilds Error

## 🚨 Vấn đề: "Error loading guilds: Failed to fetch guilds"

### ✅ Backend đã được xác nhận hoạt động:
- ✅ Backend API chạy trên port 5000
- ✅ Authentication middleware hoạt động
- ✅ Guilds API trả về `{"guilds":[]}` với token hợp lệ
- ✅ CORS được cấu hình đúng

### 🔍 Debug Frontend:

#### **Step 1: Kiểm tra Authentication State**

Mở browser console (F12) và chạy:

```javascript
// Kiểm tra authentication state
console.log('=== AUTH DEBUG ===');
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('User:', localStorage.getItem('user'));
console.log('Auth Store:', window.authStore);

// Kiểm tra API client
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Is Authenticated:', api.isAuthenticated());
```

#### **Step 2: Test API từ Browser Console**

```javascript
// Test guilds API
api.getGuilds().then(response => {
  console.log('✅ Guilds API Success:', response);
}).catch(error => {
  console.error('❌ Guilds API Error:', error);
});

// Test authentication
api.getProfile().then(response => {
  console.log('✅ Profile API Success:', response);
}).catch(error => {
  console.error('❌ Profile API Error:', error);
});
```

#### **Step 3: Kiểm tra Network Tab**

1. Mở Developer Tools (F12)
2. Chuyển sang tab **Network**
3. Refresh trang
4. Tìm request đến `/api/guilds`
5. Kiểm tra:
   - **Request Headers** có `Authorization: Bearer <token>`
   - **Response** có lỗi gì không
   - **Status Code** có phải 200/401/403

#### **Step 4: Debug Authentication Flow**

```javascript
// Test login flow
const testLogin = async () => {
  try {
    const response = await api.login({
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login Success:', response);
    
    // Test guilds after login
    const guilds = await api.getGuilds();
    console.log('✅ Guilds after login:', guilds);
  } catch (error) {
    console.error('❌ Login Error:', error);
  }
};

testLogin();
```

### 🔧 Các vấn đề thường gặp:

#### **1. User chưa đăng nhập**
```javascript
// Kiểm tra
console.log('Is Authenticated:', api.isAuthenticated());
console.log('Access Token:', localStorage.getItem('accessToken'));

// Nếu chưa đăng nhập, đăng nhập trước
await api.login({ email: 'user@example.com', password: 'password' });
```

#### **2. Token hết hạn**
```javascript
// Refresh token
try {
  await api.refreshToken();
  console.log('✅ Token refreshed');
} catch (error) {
  console.error('❌ Token refresh failed:', error);
  // Redirect to login
}
```

#### **3. CORS Issues**
```javascript
// Kiểm tra request headers
// Đảm bảo có: Authorization: Bearer <token>
// Đảm bảo có: Content-Type: application/json
```

#### **4. API Base URL sai**
```javascript
// Kiểm tra environment variable
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
// Phải là: http://localhost:5000
```

### 🛠️ Script Debug Frontend:

```javascript
// Copy và paste vào browser console
const debugFrontend = async () => {
  console.log('🔍 Frontend Debug Started');
  
  // 1. Check environment
  console.log('1. Environment Check:');
  console.log('  - API URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('  - Socket URL:', process.env.NEXT_PUBLIC_SOCKET_URL);
  
  // 2. Check authentication
  console.log('2. Authentication Check:');
  console.log('  - Access Token:', localStorage.getItem('accessToken'));
  console.log('  - User:', localStorage.getItem('user'));
  console.log('  - Is Authenticated:', api.isAuthenticated());
  
  // 3. Test API
  console.log('3. API Test:');
  try {
    const guilds = await api.getGuilds();
    console.log('  ✅ Guilds API:', guilds);
  } catch (error) {
    console.error('  ❌ Guilds API Error:', error);
  }
  
  try {
    const profile = await api.getProfile();
    console.log('  ✅ Profile API:', profile);
  } catch (error) {
    console.error('  ❌ Profile API Error:', error);
  }
  
  console.log('🔍 Frontend Debug Completed');
};

debugFrontend();
```

### 📋 Checklist Debug:

- [ ] User đã đăng nhập trong frontend
- [ ] Access token có trong localStorage
- [ ] Token không hết hạn
- [ ] API base URL đúng (`http://localhost:5000`)
- [ ] CORS được cấu hình đúng
- [ ] Network request có Authorization header
- [ ] Không có lỗi JavaScript trong console
- [ ] Backend đang chạy trên port 5000

### 🎯 Kết quả mong đợi:

#### **Console Output:**
```
🔍 Frontend Debug Started
1. Environment Check:
  - API URL: http://localhost:5000
  - Socket URL: http://localhost:5000
2. Authentication Check:
  - Access Token: eyJhbGciOiJIUzI1NiIs...
  - User: {"id":"...","username":"..."}
  - Is Authenticated: true
3. API Test:
  ✅ Guilds API: { guilds: [] }
  ✅ Profile API: { user: {...} }
🔍 Frontend Debug Completed
```

### 📞 Hỗ trợ thêm:

Nếu vẫn gặp vấn đề:

1. **Kiểm tra browser console** để xem lỗi chi tiết
2. **Kiểm tra Network tab** để xem request/response
3. **Test API trực tiếp** bằng curl hoặc Postman
4. **Kiểm tra backend logs** để xem lỗi server
5. **Clear localStorage** và đăng nhập lại

---

**DevOnNight** - Where developers connect and collaborate! 🚀