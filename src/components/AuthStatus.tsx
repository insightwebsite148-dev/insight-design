'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { LogOut, ShieldCheck, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function AuthStatus() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="flex items-center space-x-2">
      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted">Securing...</span>
    </div>
  );

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim().toLowerCase()) || [];
  const isAdmin = user && adminEmails.includes(user.email?.toLowerCase());

  return (
    <div className="flex items-center space-x-6">
      <AnimatePresence mode="wait">
        {user ? (
          <motion.div 
            key="logged-in"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center space-x-4"
          >
            <Link href={isAdmin ? '/admin' : '/profile'} className="flex items-center space-x-3 bg-white/5 pl-4 pr-1 py-1 rounded-full border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
              <div className="flex flex-col items-end">
                <span 
                  className="max-w-[80px] md:max-w-[150px] truncate text-[9px] font-black uppercase tracking-[0.1em] text-foreground leading-none mb-1 group-hover:text-accent transition-colors text-right"
                  title={user.displayName || user.email || ''}
                >
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <button 
                  onClick={(e) => { e.preventDefault(); signOut(auth); }}
                  className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>

              <div className="relative">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover group-hover:ring-2 group-hover:ring-accent transition-all duration-500" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center text-[10px] font-black group-hover:bg-accent transition-all duration-500">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full group-hover:scale-110 transition-transform duration-500" />
              </div>
            </Link>

            {isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center justify-center bg-accent text-white h-10 px-3 md:px-5 rounded-sm hover:bg-primary transition-all duration-500 shadow-lg group gap-2"
                title="Admin Dashboard"
              >
                <ShieldCheck size={14} className="group-hover:rotate-12 transition-transform text-white" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">Admin</span>
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="logged-out"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center space-x-8"
          >
            <Link 
              href="/login" 
              className="group relative overflow-hidden block"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 group-hover:text-primary transition-colors">
                Sign In
              </span>
              <motion.div 
                className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full"
              />
            </Link>
            <Link 
              href="/register" 
              className="relative group overflow-hidden bg-primary text-background px-8 py-3.5 text-[9px] font-black uppercase tracking-[0.3em] rounded-sm transition-all duration-500 active:scale-95 hover:shadow-2xl hover:shadow-primary/20 flex items-center justify-center min-w-[160px]"
            >
              <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-center w-full">Partner With Us</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
