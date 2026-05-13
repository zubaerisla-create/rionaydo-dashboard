"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
} from 'lucide-react';
import { useGetMeQuery, useUpdateMeMutation, useChangePasswordMutation } from '@/lib/adminApi';

function fmtDate(date: string) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfileSettings() {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useGetMeQuery();
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const [fullName, setFullName] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Sync fullName with profile data when it loads
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  const notify = (msg: string, ok = true) => {
    setStatus({ msg, ok });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleUpdateProfile = async () => {
    try {
      await updateMe({ full_name: fullName }).unwrap();
      notify('Profile updated successfully!');
    } catch (err) {
      notify('Failed to update profile.', false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!currentPw.trim()) {
      notify('Please enter your current password.', false);
      return;
    }
    if (!newPw.trim()) {
      notify('Please enter a new password.', false);
      return;
    }
    if (!confirmPw.trim()) {
      notify('Please confirm your new password.', false);
      return;
    }
    if (newPw !== confirmPw) {
      notify('New passwords do not match.', false);
      return;
    }
    if (newPw === currentPw) {
      notify('New password must be different from current password.', false);
      return;
    }
    if (newPw.length < 8) {
      notify('New password must be at least 8 characters long.', false);
      return;
    }

    try {
      await changePassword({
        current_password: currentPw,
        new_password: newPw,
      }).unwrap();
      notify('Password changed successfully!');
      // Clear password fields
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err: any) {
      let errorMsg = err?.data?.message || err?.error || 'Failed to change password. Please check your current password.';
      
      // Check for specific validation field errors
      const fieldErrors = err?.data?.extra?.fields;
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        errorMsg = fieldErrors[0]; // Show the first specific validation error
      }
      
      notify(errorMsg, false);
    }
  };


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
        
        {/* Toast Notification */}
        {status && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl animate-in fade-in slide-in-from-top-4 ${
            status.ok ? 'bg-emerald-900/90 border border-emerald-700 text-emerald-300' : 'bg-red-900/90 border border-red-700 text-red-300'
          }`}>
            {status.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {status.msg}
          </div>
        )}

        {/* ─── Profile Information ──────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h1 className="text-xl font-bold mb-1 text-white">Profile Information</h1>
          <p className="text-gray-400 text-sm mb-7">
            Your administrative account details
          </p>

          <div className="flex items-start gap-5 mb-8">
            

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
            <Input label="Full Name" value={fullName || profile.full_name || ''} onChange={setFullName} placeholder="Enter your full name" />
            <Field label="Email Address" icon={Mail} value={profile.email} />
            <Field label="Role" icon={Shield} value={profile.role.replace('_', ' ')} capitalize />
            <Field label="Account Created" icon={CalendarDays} value={fmtDate(profile.created_at)} />
          </div>

          <div className="flex justify-end mt-6">
            <button 
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Profile'}
            </button>
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
              <PasswordInput label="Current Password" value={currentPw} onChange={setCurrentPw} isVisible={showCurrentPw} setIsVisible={setShowCurrentPw} />
              <PasswordInput label="New Password" value={newPw} onChange={setNewPw} isVisible={showNewPw} setIsVisible={setShowNewPw} />
              <PasswordInput label="Confirm New Password" value={confirmPw} onChange={setConfirmPw} isVisible={showConfirmPw} setIsVisible={setShowConfirmPw} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => router.push('/login/forgot-email')}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
              >
                Forgot Password?
              </button>
              <button 
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-all shadow-md active:scale-95"
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
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
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full bg-gray-900 border border-gray-800 rounded-lg
          px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50
          transition-all
        "
      />
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  isVisible,
  setIsVisible,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="
            w-full bg-gray-900 border border-gray-800 rounded-lg
            px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-emerald-500/50
            transition-all
          "
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
