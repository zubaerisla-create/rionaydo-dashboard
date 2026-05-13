"use client"
import Link from 'next/link'
import Image from 'next/image'
import logo from "../../../public/logo.png"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useResetPasswordRequestMutation } from '@/lib/authApi'
import { Loader2 } from 'lucide-react'

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [resetRequest, { isLoading }] = useResetPasswordRequestMutation()
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      await resetRequest({ email }).unwrap()
      // Store email in session to use in next steps
      sessionStorage.setItem('reset_email', email)
      router.push('/login/forgot-email/verify-otp')
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to send reset link. Please check your email.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-10">

        {/* Logo / Brand */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Image
              src={logo}
              alt="SwissCarExchange Logo"
              width={180}
              height={60}
              priority
            />
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Admin Dashboard
          </p>
        </div>

        {/* Login Card - Email Verification Only */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl shadow-2xl shadow-black/40 backdrop-blur-sm p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-400">
                Enter your email to receive a verification code
              </p>
            </div>

            {/* Email Field Only */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@swisscar.ch"
                className="
                  w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                  text-gray-100 placeholder-gray-500
                  focus:outline-none focus:border-emerald-600/70 focus:ring-1 focus:ring-emerald-600/30
                  transition-all duration-150
                "
              />
            </div>

            {errorMsg && <p className="text-red-500 text-xs">{errorMsg}</p>}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                text-white font-medium py-3.5 rounded-lg
                transition-all duration-150 shadow-lg shadow-emerald-950/40
                disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2
              "
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              You will receive a magic link or one-time code
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600">
          © {new Date().getFullYear()} SwissCarExchange • Admin Portal
        </p>
      </div>
    </div>
  )
}