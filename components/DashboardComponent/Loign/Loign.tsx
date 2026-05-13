"use client";
// app/login/page.tsx

import Link from 'next/link';
import logo from "../../../public/logo.png";
import Image from 'next/image';
import { useState } from 'react';
import { useLoginMutation } from '../../../lib/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../lib/authSlice';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setCredentials({
        access: res.access,
        refresh: res.refresh,
        user: { email: res.email, role: res.role, user_id: res.user_id },
      }));
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error details:', {
        status: err?.status,
        data: err?.data,
        message: err?.data?.message || err?.error || 'Unknown error'
      });
    }
  };
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
          <div className="flex items-center justify-center gap-3">
            <div className="text-left">
              <p className="text-sm text-gray-400 font-medium">
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl shadow-2xl shadow-black/40 backdrop-blur-sm p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
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
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="
                  w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                  text-gray-100 placeholder-gray-500
                  focus:outline-none focus:border-emerald-600/70 focus:ring-1 focus:ring-emerald-600/30
                  transition-all duration-150
                "
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="
                    w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10
                    text-gray-100 placeholder-gray-500
                    focus:outline-none focus:border-emerald-600/70 focus:ring-1 focus:ring-emerald-600/30
                    transition-all duration-150
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-emerald-600 focus:ring-emerald-600"
                />
                <span>Remember me</span>
              </label>

              <Link
                href="/login/forgot-email"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="
                w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                text-white font-medium py-3.5 rounded-lg
                transition-all duration-150 shadow-lg shadow-emerald-950/40
                disabled:opacity-60 disabled:cursor-not-allowed
              "
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            {(error as any) && (
              <div className="bg-red-900/40 border border-red-800/50 rounded-lg p-3 text-red-300 text-xs flex items-start gap-2">
                <div className="flex-1">
                  <p className="font-bold uppercase tracking-widest text-[10px] mb-1 text-red-400">Authentication Error</p>
                  <p>{(error as any)?.data?.message || (error as any)?.error || "Invalid email or password. Please try again."}</p>
                  {(error as any)?.data?.extra?.fields?.map((f: string, i: number) => (
                    <p key={i} className="mt-1 font-medium">• {f}</p>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Optional footer */}
        <p className="text-center text-xs text-gray-600">
          © {new Date().getFullYear()} SwissCarExchange • Admin Portal
        </p>
      </div>
    </div>
  )
}