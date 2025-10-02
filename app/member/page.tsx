'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MemberPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to member dashboard
    router.replace('/member/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pgri-red mx-auto"></div>
        <p className="mt-4 text-gray-600">Mengalihkan ke dashboard...</p>
      </div>
    </div>
  )
}