'use client';

import { useAppSelector } from '../lib/hooks';
import { RootState } from '../lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { access } = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if we have access token
    if (!access) {
      // If no token, redirect to login unless already on login page
      if (!pathname.startsWith('/login')) {
        router.push('/login');
      }
    }
    setIsChecking(false);
  }, [access, router, pathname]);

  if (isChecking || (!access && !pathname.startsWith('/login'))) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
