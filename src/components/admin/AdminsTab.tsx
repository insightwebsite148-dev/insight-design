'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { useAdminLanguage } from '@/context/AdminLanguageContext';
import { ShieldCheck, Mail, ShieldAlert, Trash2, Plus, RefreshCw, Key } from 'lucide-react';

interface SystemAdmin {
  id: string; // usually the email or a hash
  email: string;
  addedAt: any;
  role: 'admin';
}

export default function AdminsTab() {
  const { lang, t } = useAdminLanguage();
  const aT = t.admins;
  
  const [admins, setAdmins] = useState<SystemAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const rootEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'system_admins'), orderBy('addedAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetched: SystemAdmin[] = [];
      snapshot.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() } as SystemAdmin);
      });
      setAdmins(fetched);
    } catch (error) {
      console.error('Error fetching system admins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      alert(aT.alerts.errorInvalidEmail);
      return;
    }

    const emailToSet = newEmail.trim().toLowerCase();

    if (rootEmails.includes(emailToSet) || admins.some(a => a.email === emailToSet)) {
      alert(aT.alerts.errorDuplicate);
      return;
    }

    setIsAdding(true);
    try {
      const adminId = emailToSet.replace(/[^a-zA-Z0-9]/g, '_'); // Safe ID
      await setDoc(doc(db, 'system_admins', adminId), {
        email: emailToSet,
        role: 'admin',
        addedAt: serverTimestamp()
      });
      setNewEmail('');
      alert(aT.alerts.successAdded);
      fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      alert(aT.alerts.errorAdd);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRevoke = async (id: string, email: string) => {
    if (rootEmails.includes(email.toLowerCase())) {
      alert(aT.alerts.errorRootRevoke);
      return;
    }
    
    if (confirm(lang === 'ar' ? `هل أنت متأكد من طرد ${email} نهائياً؟` : `Are you sure you want to permanently revoke access for ${email}?`)) {
      setRevokingId(id);
      try {
        await deleteDoc(doc(db, 'system_admins', id));
        alert(aT.alerts.successRevoked);
        fetchAdmins();
      } catch (error) {
        console.error('Error revoking admin:', error);
        alert(aT.alerts.errorRevoke);
      } finally {
        setRevokingId(null);
      }
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }).format(date);
  };

  return (
    <div className={`max-w-6xl mx-auto pb-16 ${lang === 'ar' ? 'font-sans text-right' : ''}`}>
      {/* Header */}
      <div className={`flex justify-between items-center mb-10 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
            {lang === 'ar' ? '' : <ShieldAlert className="text-accent" />}
            {aT.title}
            {lang === 'ar' ? <ShieldAlert className="text-accent" /> : ''}
          </h2>
          <p className="text-[12px] font-bold uppercase tracking-normal text-muted-foreground mt-1">{aT.version}</p>
        </div>
        <button
          onClick={fetchAdmins}
          disabled={loading}
          className="bg-black text-white px-5 py-2.5 flex items-center gap-2 text-[11px] font-black uppercase hover:bg-accent transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{lang === 'ar' ? 'تحديث' : 'Refresh'}</span>
        </button>
      </div>

      {/* Add Admin Panel */}
      <div className="bg-white p-10 border border-border shadow-sm mb-10">
        <h3 className={`text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Plus size={18} className="text-accent" /> {aT.addAdmin}
        </h3>
        
        <form onSubmit={handleAddAdmin} className={`flex gap-4 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex-1 relative">
            <Mail size={16} className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={aT.emailPlaceholder}
              disabled={isAdding}
              required
              className={`w-full bg-slate-50 border border-slate-200 py-3 ${lang === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} text-sm focus:outline-none focus:border-accent disabled:opacity-50`}
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !newEmail}
            className="bg-black text-white px-8 py-3 font-black uppercase text-[11px] hover:bg-accent transition-all whitespace-nowrap disabled:bg-slate-300"
          >
            {isAdding ? aT.adding : aT.addAdmin}
          </button>
        </form>
      </div>

      {/* Admins Registry */}
      <div className="bg-white border border-border shadow-sm overflow-hidden">
        <div className={`bg-slate-50 p-6 border-b border-border flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Key size={16} className="text-accent" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{aT.adminList}</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse min-w-[600px]`}>
            <thead>
              <tr className="bg-white border-b border-border/50">
                <th className={`p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{aT.table.email}</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{aT.table.role}</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{aT.table.addedAt}</th>
                <th className={`p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 ${lang === 'ar' ? 'text-left' : 'text-right'}`}>{aT.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 bg-white">
              
              {/* Root Admins (from ENV) */}
              {rootEmails.map(email => (
                <tr key={email} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 font-bold text-sm text-slate-800 flex items-center gap-3">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    {email}
                  </td>
                  <td className="p-5">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider rounded-sm border border-emerald-200">
                      {aT.roles.root}
                    </span>
                  </td>
                  <td className="p-5 text-[11px] font-bold text-slate-400 uppercase">System Default</td>
                  <td className={`p-5 ${lang === 'ar' ? 'text-left' : 'text-right'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                      {aT.actions.rootProtected}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Dynamic Admins (from Firestore) */}
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center">
                    <div className="w-5 h-5 border-2 border-accent border-t-transparent flex items-center justify-center rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : (
                admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-bold text-sm text-slate-800 flex items-center gap-3">
                      <Mail size={16} className="text-slate-400" />
                      {admin.email}
                    </td>
                    <td className="p-5">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-wider rounded-sm border border-blue-100">
                        {aT.roles.admin}
                      </span>
                    </td>
                    <td className="p-5 text-[12px] font-bold text-slate-500">
                      {formatDate(admin.addedAt)}
                    </td>
                    <td className={`p-5 ${lang === 'ar' ? 'text-left' : 'text-right'}`}>
                      <button
                        onClick={() => handleRevoke(admin.id, admin.email)}
                        disabled={revokingId === admin.id}
                        className="p-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 transition-colors rounded-sm ml-auto disabled:opacity-50 flex items-center gap-2 group"
                      >
                        <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{revokingId === admin.id ? aT.actions.revoking : aT.actions.revoke}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {!loading && admins.length === 0 && (
            <div className="p-10 text-center text-[11px] font-bold uppercase tracking-widest text-slate-300 border-t border-border/30">
              {lang === 'ar' ? 'لا يوجد مدراء إضافيين' : 'No secondary admins found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
