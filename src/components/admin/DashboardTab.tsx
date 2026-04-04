'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Activity, Briefcase, Users, ShieldCheck } from 'lucide-react';

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function DashboardOverview() {
  const { lang, t } = useAdminLanguage();
  const d = t.dashboard;
  
  const [stats, setStats] = useState([
    { label: 'Total Works', value: '0', trend: 'Updating...', icon: Briefcase, color: 'text-blue-500' },
    { label: 'Active Clients', value: '0', trend: 'Updating...', icon: Users, color: 'text-amber-500' },
    { label: 'System Status', value: d.online, trend: 'Secure', icon: Activity, color: 'text-emerald-500' },
    { label: 'Security Level', value: d.high, trend: 'Encrypted', icon: ShieldCheck, color: 'text-purple-500' }
  ]);

  // Map English Labels to Translation Keys
  const labelMap: any = {
    'Total Works': d.works,
    'Active Clients': d.clients,
    'System Status': d.status,
    'Security Level': d.security
  };

  const trendMap: any = {
    'Updating...': d.updating,
    'Real-time Sync': d.sync,
    'Secure': d.secure,
    'Encrypted': d.encrypted,
    'Online': d.online,
    'High': d.high
  };

  useEffect(() => {
    const unsubProjects = onSnapshot(query(collection(db, 'projects')), (snap) => {
      setStats(prev => prev.map(s => s.label === 'Total Works' ? { ...s, value: snap.size.toString(), trend: 'Real-time Sync' } : s));
    });

    const unsubClients = onSnapshot(query(collection(db, 'clients')), (snap) => {
      setStats(prev => prev.map(s => s.label === 'Active Clients' ? { ...s, value: snap.size.toString(), trend: 'Real-time Sync' } : s));
    });

    return () => { unsubProjects(); unsubClients(); };
  }, []);

  const title = lang === 'ar' ? 'نظرة عامة على النظام' : 'System Overview';
  const subtitle = lang === 'ar' 
    ? 'إحصائيات النظام الحالية وحالة الخادم.' 
    : 'Current system stats and server status.';

  return (
    <div className={`space-y-12 ${lang === 'ar' ? 'font-sans text-right' : ''}`}>
      <div className="border-b border-border pb-8">
        <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-3">{title}</h3>
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/80 italic max-w-2xl">{subtitle}</p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12`}>
      {stats.map((stat, i) => (
        <motion.div 
          key={stat.label} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-8 border border-border shadow-sm hover:shadow-xl transition-all group rounded-sm relative overflow-hidden"
        >
          <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
            <stat.icon size={64} />
          </div>
          
          <div className={`flex items-center gap-3 mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className={`p-2 bg-slate-50 rounded-sm ${stat.color}`}>
              <stat.icon size={16} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">{labelMap[stat.label]}</span>
          </div>
          
          <p className="text-4xl font-black tracking-tighter mb-2 text-primary">
            {stat.value}
          </p>
          
          <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${stat.label === 'Security Level' ? 'bg-purple-500' : 'bg-emerald-500'}`} />
            <span className={`text-[8px] font-bold uppercase tracking-widest text-muted-foreground`}>
               {trendMap[stat.trend] || stat.trend}
            </span>
          </div>
        </motion.div>
      ))}
      </div>
    </div>
  );
}
