"use client";

import { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  KeyRound,
  CalendarDays,
  Clock,
  Lock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useGetMeQuery } from '@/lib/adminApi';

function fmtDate(date: string) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfileSettings() {
  const { data: profile, isLoading, isError } = useGetMeQuery();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-red-400">
        <AlertCircle size={40} />
        <p>Failed to load profile information.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 ">
      <div className="mx-auto max-w-9xl space-y-8">

        {/* ─── Profile Information ──────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h1 className="text-xl font-bold mb-1 text-white">Profile Information</h1>
          <p className="text-gray-400 text-sm mb-7">
            Your administrative account details
          </p>

          <div className="flex items-start gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shrink-0">
              {profile.email.charAt(0).toUpperCase()}
            </div>

            <div className="pt-1">
              <div className="flex items-center gap-2.5 mb-1.5">
                <h2 className="text-2xl font-semibold text-white">{profile.full_name || profile.email.split('@')[0]}</h2>
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-950/90 text-amber-300 border border-amber-800/60 shadow-sm">
                  {profile.role.replace('_', ' ')}
                </span>
              </div>
              <div className="text-gray-400 flex items-center gap-2 text-sm">
                <Mail size={14} className="text-gray-500" />
                {profile.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Field label="Full Name" icon={User} value={profile.full_name || "Not set"} />
            <Field label="Email Address" icon={Mail} value={profile.email} />
            <Field label="Role" icon={Shield} value={profile.role.replace('_', ' ')} capitalize />
            <Field label="Account Created" icon={CalendarDays} value={fmtDate(profile.created_at)} />
          </div>
        </div>

        {/* ─── Security Settings ────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-7 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-1 text-white">
              <KeyRound className="text-emerald-400" size={19} />
              Security Settings
            </h2>
            <p className="text-gray-400 text-sm">
              Manage your password and security preferences
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-base font-medium flex items-center gap-2 text-gray-200">
              <Lock size={16} />
              Change Password
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input label="Current Password" type="password" value={currentPw} onChange={setCurrentPw} />
              <Input label="New Password" type="password" value={newPw} onChange={setNewPw} />
              <Input label="Confirm New Password" type="password" value={confirmPw} onChange={setConfirmPw} />
            </div>

            <div className="flex justify-end pt-2">
              <button className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg font-bold text-white transition-all shadow-md active:scale-95">
                Update Password
              </button>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-800">
            <h3 className="text-base font-medium flex items-center gap-2 mb-3 text-gray-200">
              <Shield size={16} />
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Add an extra layer of security to your account
            </p>
            <button className="px-5 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition shadow-sm">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  capitalize = false,
}: {
  label: string;
  icon: any;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
        <Icon size={13} className="text-gray-500" />
        {label}
      </label>
      <div className={`bg-gray-800/40 border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-200 ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function Input({
  label,
  type = 'text',
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          w-full bg-gray-900 border border-gray-800 rounded-lg
          px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50
          transition-all
        "
      />
    </div>
  );
}