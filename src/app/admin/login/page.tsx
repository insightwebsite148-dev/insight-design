'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
    </div>
  );
}
