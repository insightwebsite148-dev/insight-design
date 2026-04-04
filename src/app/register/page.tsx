'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Eye, EyeOff, Shield, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: fullName });
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        role: 'user',
        createdAt: new Date()
      });

      router.push('/profile'); 
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        fullName: user.displayName || 'Google User',
        email: user.email,
        role: 'user',
        createdAt: new Date()
      }, { merge: true });

      router.push('/profile');
    } catch (err: any) {
      setError('Registration with Google failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { id: 'name', label: 'Full Name', icon: User, type: 'text', value: fullName, setter: setFullName, placeholder: 'John Doe' },
    { id: 'email', label: 'Email Address', icon: Mail, type: 'email', value: email, setter: setEmail, placeholder: 'john@insight.com' },
  ];

  return (
    <div className="auth-page min-h-screen bg-[#060606] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[150px]" />
      
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
        
        {/* Left — Branding Panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col justify-between p-16 bg-white/[0.02] border border-white/[0.06] rounded-l-sm"
        >
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-accent flex items-center justify-center">
                <UserPlus size={20} className="text-white" />
              </div>
              <span className="text-[13px] font-black uppercase tracking-[0.3em] text-white/60">Insight</span>
            </div>
            
            <h2 className="text-5xl font-black text-white uppercase tracking-tight leading-[0.95] mb-6">
              Join<br />
              <span className="text-accent">Insight</span>
            </h2>
            <p className="text-sm text-white/30 leading-relaxed max-w-sm">
              Create your account to access the platform. Get started with portfolio management and client collaboration.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Shield size={18} className="text-accent/60" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">Secure registration</span>
            </div>
            <div className="h-[1px] bg-white/[0.06]" />
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/15">Encryption: AES-256</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/15">v2.0</span>
            </div>
          </div>
        </motion.div>

        {/* Right — Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white p-10 md:p-14 lg:rounded-r-sm lg:rounded-l-none rounded-sm shadow-2xl relative"
        >
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-accent flex items-center justify-center">
              <UserPlus size={16} className="text-white" />
            </div>
            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-primary/60">Insight</span>
          </div>

          <div className="mb-10">
            <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-accent mb-3 block">
              New Account
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-primary">Register</h1>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {inputFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/40 block">
                  {field.label}
                </label>
                <div className={`relative flex items-center border-b-2 transition-all duration-500 ${focusedField === field.id ? 'border-accent' : 'border-primary/10'}`}>
                  <field.icon size={18} className={`shrink-0 transition-colors duration-300 ${focusedField === field.id ? 'text-accent' : 'text-primary/20'}`} />
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    onFocus={() => setFocusedField(field.id)}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent py-4 pl-4 outline-none text-sm font-medium text-primary placeholder:text-primary/20"
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/40 block">
                Password
              </label>
              <div className={`relative flex items-center border-b-2 transition-all duration-500 ${focusedField === 'password' ? 'border-accent' : 'border-primary/10'}`}>
                <Lock size={18} className={`shrink-0 transition-colors duration-300 ${focusedField === 'password' ? 'text-accent' : 'text-primary/20'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-4 pl-4 pr-10 outline-none text-sm font-medium text-primary placeholder:text-primary/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/20 hover:text-accent transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 px-4 py-3 rounded-sm"
              >
                <p className="text-red-600 text-[11px] font-bold uppercase tracking-wider">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative h-14 bg-[#0a0a0a] overflow-hidden flex items-center justify-center gap-3 disabled:opacity-50 transition-all rounded-sm"
            >
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-[0.16,1,0.3,1]" />
              {loading ? (
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-white text-[12px] font-bold uppercase tracking-[0.3em]">Processing</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10 text-white text-[12px] font-bold uppercase tracking-[0.3em]">Create Account</span>
                  <ArrowRight size={16} className="relative z-10 text-white group-hover:translate-x-2 transition-transform duration-500" />
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/5"></div>
              </div>
              <span className="relative z-10 bg-white px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/20">or</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full group relative h-14 bg-white border-2 border-primary/5 hover:border-accent/30 overflow-hidden flex items-center justify-center gap-3 disabled:opacity-50 transition-all rounded-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="relative z-10 text-primary text-[12px] font-bold uppercase tracking-[0.2em]">
                Google Account
              </span>
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-primary/5 flex flex-col items-center gap-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary/30">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:text-accent/80 transition-colors">Sign In</Link>
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary/15">
              <Shield size={10} />
              <span>Secured Connection</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
