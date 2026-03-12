// app/profile/page.tsx
"use client"

import { useState } from 'react'
import {
  User,
  Mail,
  Shield,
  KeyRound,
  CalendarDays,
  Clock,
  Lock,
  CheckCircle2,
} from 'lucide-react'

export default function ProfileSettings() {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  const profile = {
    initials: 'S',
    name: 'Super Admin',
    email: 'admin@swisscar.ch',
    role: 'super admin',
    created: '2025-01',
    lastLogin: '3/5/2026',
    actionsToday: 12,
    actionsThisWeek: 47,
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 ">
      <div className="mx-auto max-w-9xl space-y-8">

        {/* ─── Profile Information ──────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h1 className="text-xl font-bold mb-1">Profile Information</h1>
          <p className="text-gray-400 text-sm mb-7">
            Your administrative account details
          </p>

          <div className="flex items-start gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
              {profile.initials}
            </div>

            <div className="pt-1">
              <div className="flex items-center gap-2.5 mb-1.5">
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-amber-950/90 text-amber-300 border border-amber-800/60">
                  {profile.role}
                </span>
              </div>
              <div className="text-gray-300 flex items-center gap-2">
                <Mail size={15} className="text-gray-500" />
                {profile.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Field label="Full Name" icon={User} value={profile.name} />
            <Field label="Email Address" icon={Mail} value={profile.email} />
            <Field label="Role" icon={Shield} value={profile.role} capitalize />
            <Field label="Account Created" icon={CalendarDays} value={profile.created} />
          </div>
        </div>

        {/* ─── Security Settings ────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-7">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
              <KeyRound className="text-emerald-400" size={19} />
              Security Settings
            </h2>
            <p className="text-gray-400 text-sm">
              Manage your password and security preferences
            </p>
          </div>

          {/* Change Password */}
          <div className="space-y-5">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Lock size={16} />
              Change Password
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input label="Current Password" type="password" value={currentPw} onChange={setCurrentPw} />
              <Input label="New Password" type="password" value={newPw} onChange={setNewPw} />
              <Input label="Confirm New Password" type="password" value={confirmPw} onChange={setConfirmPw} />
            </div>

            <div className="flex justify-end">
              <button className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg font-medium transition">
                Update Password
              </button>
            </div>
          </div>

          {/* 2FA (placeholder) */}
          <div className="pt-5 border-t border-gray-800">
            <h3 className="text-base font-medium flex items-center gap-2 mb-3">
              <Shield size={16} />
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Add an extra layer of security to your account
            </p>
            <button className="px-5 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition">
              Enable 2FA
            </button>
          </div>
        </div>

        {/* ─── Activity Summary ─────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Clock className="text-emerald-400" size={19} />
            Activity Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <SummaryCard label="Actions Today" value={profile.actionsToday} />
            <SummaryCard label="Actions This Week" value={profile.actionsThisWeek} />
            <SummaryCard label="Last Login" value={profile.lastLogin} smaller />
          </div>
        </div>

      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Reusable small components
// ──────────────────────────────────────────────

function Field({
  label,
  icon: Icon,
  value,
  capitalize = false,
}: {
  label: string
  icon: any
  value: string
  capitalize?: boolean
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5 flex items-center gap-1.5">
        <Icon size={15} className="text-gray-500" />
        {label}
      </label>
      <div className={`bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2.5 text-sm ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </div>
    </div>
  )
}

function Input({
  label,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          w-full bg-gray-800 border border-gray-700 rounded-lg
          px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600/60
          transition-colors
        "
      />
    </div>
  )
}

function SummaryCard({
  label,
  value,
  smaller = false,
}: {
  label: string
  value: string | number
  smaller?: boolean
}) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-5 text-center">
      <div className={`${smaller ? 'text-xl' : 'text-3xl'} font-bold mb-1.5 tracking-tight`}>
        {value}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}