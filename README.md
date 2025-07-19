# DevOnNight - Discord-like Chat Application

DevOnNight is a real-time chat application inspired by Discord, built with modern web technologies.

## 🚀 Features

### Core Features (Phase 1)
- ✅ User authentication (register/login/logout)
- ✅ Real-time messaging with Socket.IO
- ✅ Discord-like UI with dark mode
- ✅ User profiles with avatars and status
- ✅ Responsive design
- ✅ JWT-based authentication with refresh tokens

### Planned Features
- 🔄 Guild (Server) management
- 🔄 Channel creation and management
- 🔄 Role-based permissions
- 🔄 Direct messaging
- 🔄 File uploads
- 🔄 Voice channels
- 🔄 Message reactions
- 🔄 User presence
- 🔄 Invite system

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **Socket.IO** for real-time communication
- **MongoDB** with Mongoose ODM
- **Redis** for caching and session management
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Socket.IO Client** for real-time features

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB
- Redis

### Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd devonnight
```

2. Create a `.env` file in the backend directory:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

3. Start the services with Docker Compose:
```bash
docker-compose up -d
```

4. Install dependencies and start development servers:

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

### Manual Setup

1. **Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB and Redis URLs
npm run dev
```

2. **Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

3. **Database Setup:**
   - Start MongoDB instance
   - Start Redis instance
   - The application will automatically create collections on first run

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/devonnight
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 📁 Project Structure

```
devonnight/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and Redis config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── socket/          # Socket.IO handlers
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Main server file
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   ├── stores/          # Zustand stores
│   │   └── types/           # TypeScript types
│   ├── .env.local
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Management
```bash
# MongoDB shell
mongosh

# Redis CLI
redis-cli
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Health Check
- `GET /health` - Server health status

## 🔌 Socket.IO Events

### Client to Server
- `PRESENCE_UPDATE` - Update user presence
- `TYPING_START` - Start typing indicator
- `TYPING_STOP` - Stop typing indicator
- `GUILD_JOIN` - Join a guild
- `GUILD_LEAVE` - Leave a guild
- `CHANNEL_JOIN` - Join a channel
- `CHANNEL_LEAVE` - Leave a channel
- `HEARTBEAT` - Send heartbeat

### Server to Client
- `READY` - Connection ready
- `PRESENCE_UPDATE` - User presence update
- `TYPING_START` - User started typing
- `TYPING_STOP` - User stopped typing
- `MESSAGE_CREATE` - New message
- `MESSAGE_UPDATE` - Message updated
- `MESSAGE_DELETE` - Message deleted
- `HEARTBEAT_ACK` - Heartbeat acknowledged

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Discord's UI and functionality
- Built with modern web technologies
- Real-time features powered by Socket.IO

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**DevOnNight** - Where developers connect and collaborate! 🚀