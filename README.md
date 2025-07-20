# DevOnNight - Discord-like Chat Application

A modern, real-time chat application built with Next.js, Node.js, Socket.IO, and MongoDB.

## 🚀 Features

### Core Features
- **Real-time messaging** with Socket.IO
- **Guild/Server system** with multiple channels
- **Direct messaging** between users
- **File uploads** with image thumbnails
- **Message reactions** and emoji support
- **Typing indicators** and presence system

### Advanced Features
- **Threads and replies** for organized discussions
- **Voice channels** with mute/deafen controls
- **Role-based permissions** with bitwise flags
- **Search functionality** across messages, channels, guilds, and users
- **Moderation tools** (kick, ban, timeout) with audit logs
- **Bot management** with custom tokens
- **Webhook system** for external integrations

### UI/UX Features
- **Modern dark theme** with Tailwind CSS
- **Responsive design** for all devices
- **Modal dialogs** and interactive components
- **Progress bars** and loading states
- **Tabbed interfaces** for organization

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Redis** for caching and sessions
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Multer** for file uploads
- **Sharp** for image processing

### Frontend
- **Next.js 13+** with App Router
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Socket.IO Client** for real-time updates
- **Date-fns** for date formatting

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB 5+
- Redis 6+
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devonnight
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `.env` files in both `backend/` and `frontend/` directories:

   **Backend (.env)**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/devonnight
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=http://localhost:3000
   SOCKET_CORS_ORIGIN=http://localhost:3000
   UPLOAD_PATH=../uploads
   ```

   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both backend (port 5000) and frontend (port 3000) simultaneously.

## 🏃‍♂️ Development

### Available Scripts

```bash
# Development
npm run dev                    # Start both backend and frontend
npm run dev:backend           # Start only backend
npm run dev:frontend          # Start only frontend

# Production
npm run build                 # Build both backend and frontend
npm run start                 # Start production servers

# Installation
npm run install:all          # Install all dependencies
npm run setup                # Install and build everything
```

### Project Structure

```
devonnight/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── socket/         # Socket.IO handlers
│   │   ├── config/         # Database and Redis config
│   │   └── utils/          # Utility functions
│   └── uploads/            # File uploads directory
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   ├── stores/        # Zustand stores
│   │   ├── lib/           # Utility functions
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
└── package.json           # Root package.json
```

## 🔧 Configuration

### Backend Configuration

The backend can be configured through environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Backend server port |
| `MONGODB_URI` | - | MongoDB connection string |
| `REDIS_URL` | - | Redis connection string |
| `JWT_SECRET` | - | JWT signing secret |
| `CORS_ORIGIN` | http://localhost:3000 | CORS allowed origin |
| `UPLOAD_PATH` | ../uploads | File upload directory |

### Frontend Configuration

The frontend can be configured through environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | http://localhost:5000 | Backend API URL |
| `NEXT_PUBLIC_SOCKET_URL` | http://localhost:5000 | Socket.IO server URL |

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production servers**
   ```bash
   npm start
   ```

### Docker Deployment

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/devonnight
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Guilds
- `GET /api/guilds` - Get user's guilds
- `POST /api/guilds` - Create new guild
- `GET /api/guilds/:id` - Get guild details
- `GET /api/guilds/:id/members` - Get guild members

### Channels
- `GET /api/channels` - Get guild channels
- `POST /api/channels` - Create new channel
- `PUT /api/channels/:id` - Update channel
- `DELETE /api/channels/:id` - Delete channel

### Messages
- `GET /api/messages/:channelId` - Get channel messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message

### Voice
- `POST /api/voice/channels/:id/join` - Join voice channel
- `POST /api/voice/channels/:id/leave` - Leave voice channel
- `GET /api/voice/channels/:id/participants` - Get voice participants

### Moderation
- `POST /api/moderation/kick` - Kick user
- `POST /api/moderation/ban` - Ban user
- `POST /api/moderation/timeout` - Timeout user
- `GET /api/audit/guilds/:id/audit-logs` - Get audit logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Discord's design and functionality
- Built with modern web technologies
- Real-time communication powered by Socket.IO
- Beautiful UI with Tailwind CSS

---

**DevOnNight** - Where developers connect and collaborate! 🚀