'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  User, Mail, Calendar, LogOut, ArrowRight, 
  Shield, Star, Clock, ChevronRight, Home,
  Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);

      // Fetch user data from Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }

      // Show welcome animation for new sessions
      const welcomeShown = sessionStorage.getItem('welcomeShown');
      if (!welcomeShown) {
        setShowWelcome(true);
        sessionStorage.setItem('welcomeShown', 'true');
        setTimeout(() => setShowWelcome(false), 4000);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('welcomeShown');
    router.push('/');
  };

  const getMemberSince = () => {
    const date = userData?.createdAt?.toDate?.() || user?.metadata?.creationTime;
    if (!date) return 'Recently';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getInitials = () => {
    const name = user?.displayName || userData?.fullName || user?.email || 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-12 h-12 border-2 border-white/10 border-t-accent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Loading Profile</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] relative">
      {/* Welcome Toast */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-[#0a0a0a] text-white px-8 py-4 rounded-full shadow-2xl border border-white/10 flex items-center gap-4"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1, repeat: 2 }}
          >
            <Sparkles size={20} className="text-accent" />
          </motion.div>
          <div>
            <p className="text-[13px] font-bold">
              Welcome back, <span className="text-accent">{user?.displayName?.split(' ')[0] || 'there'}</span>! 👋
            </p>
            <p className="text-[10px] text-white/40 font-medium">Great to see you again</p>
          </div>
        </motion.div>
      )}

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Home size={18} className="text-black/30 group-hover:text-accent transition-colors" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black/40 group-hover:text-accent transition-colors">
              Back to Site
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 hover:bg-red-50 hover:text-red-500 text-black/40 transition-all group"
          >
            <LogOut size={14} className="group-hover:text-red-500 transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Logout</span>
          </button>
        </div>
      </div>

      {/* Profile Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.4) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
        
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Profile'} 
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-accent/30 shadow-2xl"
                />
              ) : (
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-accent flex items-center justify-center border-4 border-accent/30 shadow-2xl">
                  <span className="text-3xl md:text-4xl font-black text-white">{getInitials()}</span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </motion.div>

            {/* Name & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center md:text-left flex-1"
            >
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                {user?.displayName || userData?.fullName || 'User'}
              </h1>
              <p className="text-white/30 text-sm font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail size={14} /> {user?.email}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <span className="px-4 py-1.5 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  Member
                </span>
                <span className="text-white/20 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
                  <Calendar size={12} /> Since {getMemberSince()}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-xl shadow-black/5 border border-black/5 group hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-500">
                <User size={18} className="text-accent group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-black/70">Account Details</h3>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mb-1">Full Name</p>
                <p className="text-[15px] font-bold text-black">{user?.displayName || userData?.fullName || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mb-1">Email Address</p>
                <p className="text-[15px] font-bold text-black truncate">{user?.email || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 mb-1">Auth Provider</p>
                <p className="text-[15px] font-bold text-black flex items-center gap-2">
                  <Shield size={14} className="text-accent" />
                  {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email/Password'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Explore Portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-xl shadow-black/5 border border-black/5 group hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-500">
                <Star size={18} className="text-accent group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-black/70">Explore</h3>
            </div>
            <p className="text-sm text-black/40 leading-relaxed mb-8">
              Discover our latest design projects and see how we transform spaces into extraordinary experiences.
            </p>
            <div className="space-y-3">
              <Link href="/portfolio" className="flex items-center justify-between p-4 bg-black/[0.02] rounded-xl hover:bg-accent/5 transition-all group/link">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-black/60 group-hover/link:text-accent transition-colors">Our Works</span>
                <ChevronRight size={14} className="text-black/20 group-hover/link:text-accent group-hover/link:translate-x-1 transition-all" />
              </Link>
              <Link href="/about" className="flex items-center justify-between p-4 bg-black/[0.02] rounded-xl hover:bg-accent/5 transition-all group/link">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-black/60 group-hover/link:text-accent transition-colors">About Us</span>
                <ChevronRight size={14} className="text-black/20 group-hover/link:text-accent group-hover/link:translate-x-1 transition-all" />
              </Link>
              <Link href="/contact" className="flex items-center justify-between p-4 bg-black/[0.02] rounded-xl hover:bg-accent/5 transition-all group/link">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-black/60 group-hover/link:text-accent transition-colors">Contact Us</span>
                <ChevronRight size={14} className="text-black/20 group-hover/link:text-accent group-hover/link:translate-x-1 transition-all" />
              </Link>
            </div>
          </motion.div>

          {/* Card 3: Get a Consultation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-2xl p-8 shadow-xl border border-white/5 group hover:shadow-2xl transition-all duration-500 md:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                <Sparkles size={18} className="text-accent" />
              </div>
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white/70">Free Consultation</h3>
            </div>
            <p className="text-sm text-white/30 leading-relaxed mb-8">
              Have a project in mind? Get a free consultation with our design experts and start transforming your vision today.
            </p>
            <Link 
              href="/contact"
              className="w-full flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold text-[12px] uppercase tracking-[0.2em] transition-all group/btn shadow-lg shadow-accent/20"
            >
              <span>Book Now</span>
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
              <Clock size={14} className="text-white/20" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em]">Usually responds within 24h</span>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
