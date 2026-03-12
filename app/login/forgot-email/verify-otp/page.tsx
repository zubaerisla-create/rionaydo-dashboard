// app/verify-otp/page.tsx
"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import logo from "../../../../public/logo.png"
import Link from 'next/link'

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // only allow digits

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // take only last character
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').trim()
    if (!/^\d{6}$/.test(pasted)) return

    const digits = pasted.split('')
    setOtp(digits)
    inputRefs.current[5]?.focus() // focus last box
  }

  const isComplete = otp.every(digit => digit !== '')

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

        {/* OTP Card */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl shadow-2xl shadow-black/40 backdrop-blur-sm p-8">
          <div className="space-y-8">

            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                Enter Verification Code
              </h2>
              <p className="text-sm text-gray-400">
                We sent a 6-digit code to your email
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex flex-col items-center gap-4">
              <label className="block text-sm font-medium text-gray-300">
                OTP
              </label>

              <div className="flex gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={(e) => handlePaste(e, index)}
                    ref={(el) => { inputRefs.current[index] = el }}
                    className={`
                      w-12 h-12 text-center text-2xl font-bold bg-gray-800 
                      border border-gray-700 rounded-lg text-white
                      focus:outline-none focus:border-emerald-600/70 focus:ring-1 focus:ring-emerald-600/30
                      transition-all duration-150
                      ${digit ? 'border-emerald-600/50' : ''}
                    `}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Submit Button */}
             <Link href="/login/forgot-email/verify-otp/new-password">
             
              <button
                type="button"
                disabled={!isComplete}
                className={`
                  w-full py-3.5 rounded-lg font-medium transition-all duration-150
                  shadow-lg shadow-emerald-950/40
                  ${isComplete 
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white cursor-pointer' 
                    : 'bg-emerald-800/50 text-gray-400 cursor-not-allowed'}
                `}
              >
                Submit
              </button>
             </Link>
            </div>

            {/* Resend */}
            <div className="text-center space-y-2">
              <button className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
                Resend
              </button>

              <p className="text-xs text-gray-500">
                Authorized access only. All activities are logged.
              </p>

              <Link
                href="/login"
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors block mt-3"
              >
                ← Back to Login
              </Link>
            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600">
          © {new Date().getFullYear()} SwissCarExchange • Admin Portal
        </p>

      </div>
    </div>
  )
}