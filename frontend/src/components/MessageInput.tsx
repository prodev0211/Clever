'use client';

import { useState, KeyboardEvent } from 'react';
import { useChannelStore } from '@/stores/channelStore';
import { Button } from '@/components/ui/Button';
import { FileUpload } from './FileUpload';

interface MessageInputProps {
  channelId?: string;
  disabled?: boolean;
}

export function MessageInput({ channelId, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const { sendMessage, loading } = useChannelStore();

  const handleSubmit = async () => {
    if (!channelId || !message.trim() || loading) return;

    try {
      await sendMessage(channelId, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    // Typing indicator implementation
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false);
    }
  };

  if (!channelId) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>Select a channel to send messages</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message #general"
            disabled={disabled || loading}
            className="w-full min-h-[44px] max-h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            rows={1}
          />
          
          {/* Character count */}
          {message.length > 0 && (
            <div className="absolute bottom-1 right-2 text-xs text-gray-400">
              {message.length}/2000
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Attachment button */}
          <button
            onClick={() => setShowFileUpload(true)}
            disabled={disabled || loading}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Emoji button */}
          <button
            disabled={disabled || loading}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add emoji"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Send button */}
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || loading || disabled}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </Button>
        </div>
      </div>
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="mt-2 text-xs text-gray-400">
          <span className="animate-pulse">Typing...</span>
        </div>
      )}
      
      {/* File Upload Modal */}
      {showFileUpload && (
        <FileUpload
          onFilesUploaded={(attachments) => {
            // Handle file uploads
            if (attachments.length > 0) {
              // TODO: Add attachments to message content
            }
            setShowFileUpload(false);
          }}
          onClose={() => setShowFileUpload(false)}
        />
      )}
    </div>
  );
}