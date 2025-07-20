'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Users, 
  Mic, 
  Shield, 
  Zap, 
  Sparkles,
  ArrowRight,
  Play,
  Github,
  Twitter
} from 'lucide-react'

export function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      icon: MessageCircle,
      title: 'Real-time Messaging',
      description: 'Instant messaging with rich text formatting, emojis, and file sharing'
    },
    {
      icon: Users,
      title: 'Server Communities',
      description: 'Create and join servers with unlimited channels and roles'
    },
    {
      icon: Mic,
      title: 'Voice Channels',
      description: 'Crystal clear voice chat with noise suppression and echo cancellation'
    },
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'End-to-end encryption and comprehensive moderation tools'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed with WebSocket connections and CDN'
    },
    {
      icon: Sparkles,
      title: 'Modern UI',
      description: 'Beautiful, responsive design with dark theme and animations'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold gradient-text">DevOnNight</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login"
                className="btn-secondary px-4 py-2 rounded-lg hover-lift"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register"
                className="btn-primary px-6 py-2 rounded-lg hover-lift"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Where{' '}
              <span className="gradient-text">Developers</span>
              <br />
              Connect & Collaborate
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The modern Discord alternative built for developers. Real-time messaging, 
              voice channels, and powerful collaboration tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/auth/register"
                className="btn-primary px-8 py-4 rounded-lg text-lg font-semibold hover-lift flex items-center gap-2"
              >
                Start Building
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="btn-secondary px-8 py-4 rounded-lg text-lg font-semibold hover-lift flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to build amazing communities
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed for modern teams and communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-xl hover-lift"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-xl"
            >
              <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-gray-300">Active Users</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-xl"
            >
              <div className="text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-gray-300">Servers Created</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-xl"
            >
              <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to build your community?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers who are already using DevOnNight
            </p>
            <Link 
              href="/auth/register"
              className="btn-primary px-8 py-4 rounded-lg text-lg font-semibold hover-lift inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <h3 className="text-xl font-bold gradient-text">DevOnNight</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2024 DevOnNight. Built with ❤️ for developers.
          </div>
        </div>
      </footer>
    </div>
  )
}