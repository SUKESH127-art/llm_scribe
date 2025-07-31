'use client'

import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          searchParams.get('code') || ''
        )
        
        if (error) {
          console.error('Auth error:', error)
          router.replace('/login?error=auth_failed')
          return
        }

        if (data.session) {
          // Successfully authenticated, redirect to dashboard
          router.replace('/dashboard')
        } else {
          // No session found, redirect to login
          router.replace('/login')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        router.replace('/login?error=unexpected')
      } finally {
        setIsProcessing(false)
      }
    }

    if (searchParams.get('code')) {
      handleAuthCallback()
    } else {
      // No code parameter, redirect to login
      router.replace('/login')
    }
  }, [router, supabase, searchParams])

  if (!isProcessing) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Processing...</h2>
        <p className="text-muted-foreground">Please wait while we complete your sign in.</p>
      </div>
    </div>
  )
} 