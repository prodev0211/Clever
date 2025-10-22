# 🚀 DevOnNight - Modern Discord Alternative

A beautiful, modern Discord-like chat application built for developers with real-time messaging, voice channels, and powerful collaboration tools.

![DevOnNight](https://img.shields.io/badge/DevOnNight-Modern%20Discord%20Alternative-purple?style=for-the-badge&logo=discord)

## ✨ Features

### 🎨 Modern Design
- **Dark Theme** with beautiful gradients and glass morphism effects
- **Responsive Design** that works on desktop, tablet, and mobile
- **Smooth Animations** powered by Framer Motion
- **Modern UI Components** with hover effects and transitions

### 💬 Real-time Messaging
- **Instant Messaging** with WebSocket connections
- **Message History** with date separators and timestamps
- **Typing Indicators** to show when users are typing
- **Message Actions** (edit, delete, reactions)
- **File Sharing** support for images and documents

### 🏠 Server Management
- **Create Servers** with custom icons and descriptions
- **Channel Categories** (Text, Voice, Announcements)
- **Role Management** with custom permissions
- **Member Management** with status indicators

### 👥 User Features
- **User Profiles** with avatars and status
- **Online Status** indicators (Online, Idle, Do Not Disturb, Offline)
- **Custom Status** messages
- **Voice Channel** support with speaking indicators

### 🔧 Developer Features
- **Modern Tech Stack** (Next.js 14, TypeScript, Tailwind CSS)
- **State Management** with Zustand
- **Real-time Updates** with Socket.IO
- **Type Safety** throughout the application

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devonnight.git
   cd devonnight
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend (.env)
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/devonnight
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret

   # Frontend (.env.local)
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Or using MongoDB locally
   mongod
   ```

5. **Start the development servers**
   ```bash
   # Start backend (in one terminal)
   cd backend
   npm run dev

   # Start frontend (in another terminal)
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Usage

### Getting Started
1. **Visit the landing page** at http://localhost:3000
2. **Create an account** or sign in with existing credentials
3. **Create your first server** using the "+" button
4. **Invite friends** to your server
5. **Start chatting** in text channels or join voice channels

### Features Guide

#### 🏠 Creating Servers
- Click the "+" button in the server list
- Choose a server name and description
- Upload a custom server icon (optional)
- Your server is ready!

#### 💬 Messaging
- Select a text channel from the channel list
- Type your message and press Enter
- Use emojis, file attachments, and formatting
- React to messages with emojis

#### 🎤 Voice Channels
- Click on a voice channel to join
- Use the microphone button to speak
- Mute/deafen yourself as needed
- See who's speaking with visual indicators

#### 👥 User Management
- Click on user profiles to view details
- Set custom status messages
- Manage server roles and permissions
- View online status and activity

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Background**: Dark slate (#0f0f23 to #16213e)
- **Surface**: Glass morphism with blur effects
- **Text**: White and gray variations

### Components
- **Glass Cards**: Semi-transparent with backdrop blur
- **Gradient Buttons**: Purple gradients with hover effects
- **Status Indicators**: Color-coded online status
- **Message Bubbles**: Rounded with subtle gradients

### Animations
- **Page Transitions**: Smooth fade and slide effects
- **Hover Effects**: Lift and glow animations
- **Loading States**: Spinner and skeleton animations
- **Typing Indicators**: Animated dots

## 🔧 Development

### Project Structure
```
devonnight/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth and validation
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── stores/        # Zustand stores
│   │   ├── types/         # TypeScript types
│   │   └── lib/           # Utilities and API
│   └── package.json
└── README.md
```

### Key Components

#### Frontend Components
- `AppLayout` - Main application layout
- `LandingPage` - Beautiful landing page
- `ServerList` - Server navigation sidebar
- `ChannelList` - Channel navigation
- `MessageArea` - Chat interface
- `UserList` - Member list
- `UserProfile` - User dropdown menu

#### Backend API
- `auth` - Authentication routes
- `guilds` - Server management
- `channels` - Channel management
- `messages` - Message handling
- `users` - User management

### State Management
- `authStore` - User authentication state
- `guildStore` - Server and channel state
- `messageStore` - Message state
- `userStore` - User state

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
cd backend
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build for production
cd frontend
npm run build

# Start production server
npm start
```

### Environment Variables
Make sure to set all required environment variables in production:
- Database connection strings
- JWT secrets
- API URLs
- CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Discord** for inspiration
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons

---

**DevOnNight** - Where developers connect and collaborate! 🚀

Made with ❤️ for the developer community