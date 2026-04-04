'use client';

import { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';
import ClientCardAdmin from './clients/ClientCardAdmin';
import ClientModal from './clients/ClientModal';

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function ClientsTab() {
  const { lang, t } = useAdminLanguage();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (client: any = null) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: { name: string; logo: string }) => {
    if (editingClient) {
      await updateDoc(doc(db, 'clients', editingClient.id), {
        name: formData.name.toUpperCase(),
        logo: formData.logo,
        updatedAt: serverTimestamp()
      });
    } else {
      await addDoc(collection(db, 'clients'), {
        name: formData.name.toUpperCase(),
        logo: formData.logo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(t.clients.deleteConfirm.replace('{name}', name))) {
      await deleteDoc(doc(db, 'clients', id));
    }
  };

  return (
    <div className={lang === 'ar' ? 'font-sans' : ''}>
      <div className="flex justify-between items-center mb-7">
        <div>
          <h3 className="text-2xl font-bold tracking-tighter uppercase leading-none mb-2">{t.clients.title}</h3>
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent">{t.clients.subtitle}</p>
        </div>
        <button onClick={() => handleOpenModal()}
          className="bg-primary text-background px-6 py-3 text-[11px] font-bold uppercase tracking-widest flex items-center space-x-3 gap-3 hover:bg-accent transition-all shadow-xl hover:shadow-accent/20 rounded-sm"
        >
          <Plus size={18} /> <span>{t.clients.add}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="col-span-full py-12 flex flex-col items-center">
              <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-sm animate-spin mb-6" />
              <span className="text-[12px] font-black uppercase tracking-[0.5em] text-muted">{t.clients.loading}</span>
            </div>
          ) : clients.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed border-border bg-slate-50/50 rounded-sm">
              <AlertCircle className="mx-auto text-muted/20 mb-6" size={48} />
              <p className="text-[12px] font-black uppercase tracking-[0.4em] text-muted">{t.clients.empty}</p>
            </div>
          ) : (
            clients.map((client, i) => (
              <ClientCardAdmin key={client.id} client={client} index={i} onEdit={handleOpenModal} onDelete={handleDelete} />
            ))
          )}
        </AnimatePresence>
      </div>

      <ClientModal isOpen={isModalOpen} editingClient={editingClient} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
    </div>
  );
}
