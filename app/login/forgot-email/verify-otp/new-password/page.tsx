// app/reset-password/page.tsx   (or app/forgot-password/reset/page.tsx)
"use client"

import { useState } from 'react'
import Image from 'next/image'
import logo from "../../../../../public/logo.png"
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0

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

        {/* Password Reset Card */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl shadow-2xl shadow-black/40 backdrop-blur-sm p-8">
          <div className="space-y-8">

            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                Set New Password
              </h2>
              <p className="text-sm text-gray-400">
                Choose a strong password for your account
              </p>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-300">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                placeholder="Enter your password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="
                  w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                  text-gray-100 placeholder-gray-500
                  focus:outline-none focus:border-emerald-600/70 focus:ring-1 focus:ring-emerald-600/30
                  transition-all duration-150
                "
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                Retype Password
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`
                  w-full bg-gray-800 border rounded-lg px-4 py-3
                  text-gray-100 placeholder-gray-500
                  focus:outline-none focus:border-emerald-600/70 focus:ring-1 focus:ring-emerald-600/30
                  transition-all duration-150
                  ${confirmPassword && !passwordsMatch 
                    ? 'border-red-600 focus:border-red-600' 
                    : 'border-gray-700'}
                `}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-400 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

        

            {/* Submit Button */}
  <Link href="/login" >
  
            <button
              type="button"
              disabled={!passwordsMatch || !newPassword}
              className={`
                w-full py-3.5 rounded-lg font-medium transition-all duration-150
                shadow-lg shadow-emerald-950/40
                ${passwordsMatch && newPassword
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white cursor-pointer'
                  : 'bg-emerald-800/50 text-gray-400 cursor-not-allowed'}
              `}
            >
              Update Password
            </button>
  </Link>

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