'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { LandingPage } from '@/components/landing/LandingPage'
import { AppLayout } from '@/components/layout/AppLayout'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/app')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return <AppLayout />
  }

  return <LandingPage />
}