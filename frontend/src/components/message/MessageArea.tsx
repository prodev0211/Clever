'use client'

import { useState, useEffect, useRef } from 'react'
import { useSocket } from '@/components/providers/SocketProvider'
import { useAuthStore } from '@/stores/authStore'
import { useGuildStore } from '@/stores/guildStore'
import { 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react'

interface Message {
  id: string
  content: string
  author: {
    id: string
    username: string
    avatar?: string
  }
  timestamp: Date
  edited?: boolean
}

export function MessageArea() {
  const { socket, isConnected } = useSocket()
  const { user } = useAuthStore()
  const { currentGuild } = useGuildStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Sample messages for demo
  const sampleMessages: Message[] = [
    {
      id: '1',
      content: 'Welcome to DevOnNight! 🚀',
      author: {
        id: '1',
        username: 'DevOnNight',
        avatar: '/api/placeholder/32/32'
      },
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      content: 'This is a modern Discord alternative built for developers!',
      author: {
        id: '2',
        username: 'Alex',
        avatar: '/api/placeholder/32/32'
      },
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: '3',
      content: 'I love the dark theme and modern UI! ✨',
      author: {
        id: '3',
        username: 'Sarah',
        avatar: '/api/placeholder/32/32'
      },
      timestamp: new Date(Date.now() - 900000)
    },
    {
      id: '4',
      content: 'The real-time messaging is so smooth!',
      author: {
        id: '4',
        username: 'Mike',
        avatar: '/api/placeholder/32/32'
      },
      timestamp: new Date(Date.now() - 300000)
    }
  ]

  useEffect(() => {
    setMessages(sampleMessages)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      author: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Emit to socket if connected
    if (socket && isConnected) {
      socket.emit('message', {
        content: message.content,
        guildId: currentGuild?.id,
        channelId: 'general'
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  if (!currentGuild) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Select a Server</h2>
          <p className="text-gray-400">Choose a server from the sidebar to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const showDate = index === 0 || 
            formatDate(message.timestamp) !== formatDate(messages[index - 1]?.timestamp)
          
          return (
            <div key={message.id}>
              {/* Date separator */}
              {showDate && (
                <div className="flex items-center justify-center my-4">
                  <div className="glass px-3 py-1 rounded-full">
                    <span className="text-xs text-gray-400">{formatDate(message.timestamp)}</span>
                  </div>
                </div>
              )}
              
              {/* Message */}
              <div className="message-bubble p-4 rounded-lg hover-lift">
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {message.author.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Message content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold text-white">
                        {message.author.username}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.edited && (
                        <span className="text-xs text-gray-500">(edited)</span>
                      )}
                    </div>
                    <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Message actions */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
              <span className="text-sm text-gray-400">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="glass border-t border-gray-800 p-4">
        <div className="flex items-end space-x-3">
          {/* File upload */}
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          
          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${currentGuild.name}`}
              className="input-modern w-full px-4 py-3 rounded-lg resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          {/* Emoji picker */}
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          {/* Voice message */}
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          
          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="btn-primary p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}