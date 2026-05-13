"use client";

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { hideToast } from '@/lib/toastSlice';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { message, type, visible } = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  if (!visible || !message) return null;

  return (
    <div className={`fixed bottom-8 right-8 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold shadow-2xl animate-in slide-in-from-bottom-5 duration-300 border ${
      type === 'success' 
        ? "bg-emerald-950/90 border-emerald-500 text-emerald-400 backdrop-blur-md" 
        : "bg-red-950/90 border-red-500 text-red-400 backdrop-blur-md"
    }`}>
      <div className={`p-1.5 rounded-lg ${type === 'success' ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </div>
      <div className="flex-1 pr-2">{message}</div>
      <button 
        onClick={() => dispatch(hideToast())}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
