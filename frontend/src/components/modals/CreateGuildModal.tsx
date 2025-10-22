'use client'

import { useState } from 'react'
import { useGuildStore } from '@/stores/guildStore'
import { X, Upload, Sparkles } from 'lucide-react'

interface CreateGuildModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateGuildModal({ isOpen, onClose }: CreateGuildModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { createGuild } = useGuildStore()

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIcon(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      await createGuild(name.trim(), description.trim())
      onClose()
      setName('')
      setDescription('')
      setIcon(null)
      setIconPreview('')
    } catch (error) {
      console.error('Failed to create guild:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass rounded-2xl p-8 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create Server</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Server Icon */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt="Server icon"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <Sparkles className="w-8 h-8 text-white" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-2xl">
                <Upload className="w-6 h-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-400 text-center">
              Click to upload server icon (optional)
            </p>
          </div>

          {/* Server Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Server Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-modern w-full px-4 py-3 rounded-lg"
              placeholder="Enter server name"
              required
              maxLength={100}
            />
          </div>

          {/* Server Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-modern w-full px-4 py-3 rounded-lg resize-none"
              placeholder="Enter server description (optional)"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="btn-primary flex-1 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Server'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}