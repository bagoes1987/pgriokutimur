'use client'

import { useState, useEffect } from 'react'

export default function TestAuthPage() {
  const [authData, setAuthData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    testAuth()
  }, [])

  const testAuth = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      if (response.ok) {
        setAuthData(data)
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Starting login test...')
      
      // Test login
      const loginResponse = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
      })
      
      console.log('Login response status:', loginResponse.status)
      const headerEntries: Array<[string, string]> = []
      loginResponse.headers.forEach((value, key) => {
        headerEntries.push([key, value])
      })
      console.log('Login response headers:', headerEntries)
      
      const loginData = await loginResponse.json()
      console.log('Login response data:', loginData)
      
      if (loginData.success) {
        console.log('Current cookies after login:', document.cookie)
        
        // Test auth check
        const authResponse = await fetch('/api/auth/me')
        console.log('Auth check status:', authResponse.status)
        
        const authData = await authResponse.json()
        console.log('Auth check data:', authData)
        setAuthData(authData)
        
        // Try to redirect to admin dashboard
        console.log('Attempting to redirect to admin dashboard...')
        window.location.href = '/admin/dashboard'
      } else {
        setError('Login failed: ' + JSON.stringify(loginData))
      }
    } catch (err) {
      console.error('Error:', err)
      const msg = err instanceof Error ? err.message : String(err)
      setError('Login test error: ' + msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Status:</h2>
            <p className={`text-sm ${loading ? 'text-yellow-600' : error ? 'text-red-600' : 'text-green-600'}`}>
              {loading ? 'Loading...' : error ? `Error: ${error}` : 'Success'}
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold">Cookies:</h2>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {mounted ? document.cookie || 'No cookies' : 'Loading...'}
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold">Auth Data:</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {authData ? JSON.stringify(authData, null, 2) : 'No auth data'}
            </pre>
          </div>
          
          <div className="space-x-4">
            <button
              onClick={testAuth}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Auth'}
            </button>
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Login & Redirect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}