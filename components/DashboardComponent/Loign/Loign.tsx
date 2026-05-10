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

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
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
    } catch (err) {
      console.error('Login failed:', err);
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
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="
                  w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                  text-gray-100 placeholder-gray-500
                  focus:outline-none focus:border-emerald-600/70 focus:ring-1 focus:ring-emerald-600/30
                  transition-all duration-150
                "
              />
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
            {error && <div className="text-red-500 text-sm mt-2">Login failed. Please check your credentials.</div>}
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