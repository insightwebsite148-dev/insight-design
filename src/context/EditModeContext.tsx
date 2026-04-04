'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { EDITABLE_COLLECTIONS, EDITABLE_DOCUMENTS } from '@/lib/edit-config';

// ─── Types ─────────────────────────────────────────────────────────
interface PendingChange {
  id: string;
  collection: string;        // e.g. 'settings' or 'projects'
  documentId: string;         // e.g. 'general' or a project ID
  field: string;              // e.g. 'heroHeadline'
  oldValue: any;
  newValue: any;
  type: 'text' | 'image' | 'color' | 'size' | 'alignment';
  timestamp: number;
}

interface EditModeContextType {
  isEditMode: boolean;
  isAdmin: boolean;
  toggleEditMode: () => void;
  pendingChanges: PendingChange[];
  addChange: (change: Omit<PendingChange, 'id' | 'timestamp'>) => void;
  removeChange: (id: string) => void;
  publishAll: () => Promise<void>;
  discardAll: () => void;
  isPublishing: boolean;
  publishStatus: 'idle' | 'publishing' | 'success' | 'error';
}

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  isAdmin: false,
  toggleEditMode: () => {},
  pendingChanges: [],
  addChange: () => {},
  removeChange: () => {},
  publishAll: async () => {},
  discardAll: () => {},
  isPublishing: false,
  publishStatus: 'idle',
});

export function useEditMode() {
  return useContext(EditModeContext);
}

// ─── Provider ──────────────────────────────────────────────────────
export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');

  // Check admin status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim().toLowerCase()) || [];
        setIsAdmin(adminEmails.includes(user.email?.toLowerCase() || ''));
      } else {
        setIsAdmin(false);
        setIsEditMode(false);
        setPendingChanges([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync edit mode to body class for CSS overrides
  useEffect(() => {
    if (isEditMode) {
      document.body.setAttribute('data-edit-mode', 'true');
    } else {
      document.body.removeAttribute('data-edit-mode');
    }
  }, [isEditMode]);

  const toggleEditMode = useCallback(() => {
    if (!isAdmin) return;
    setIsEditMode(prev => {
      if (prev && pendingChanges.length > 0) {
        // Warn if there are unsaved changes
        const confirm = window.confirm('You have unsaved changes. Discard them?');
        if (!confirm) return prev;
        setPendingChanges([]);
      }
      return !prev;
    });
  }, [isAdmin, pendingChanges]);

  const addChange = useCallback((change: Omit<PendingChange, 'id' | 'timestamp'>) => {
    const newChange: PendingChange = {
      ...change,
      id: `${change.collection}-${change.documentId}-${change.field}-${Date.now()}`,
      timestamp: Date.now(),
    };

    setPendingChanges(prev => {
      // Replace existing change for same field
      const filtered = prev.filter(
        c => !(c.collection === change.collection && c.documentId === change.documentId && c.field === change.field)
      );
      return [...filtered, newChange];
    });
  }, []);

  const removeChange = useCallback((id: string) => {
    setPendingChanges(prev => prev.filter(c => c.id !== id));
  }, []);

  const discardAll = useCallback(() => {
    setPendingChanges([]);
    // Force page reload to revert visual changes
    window.location.reload();
  }, []);

  const publishAll = useCallback(async () => {
    if (pendingChanges.length === 0) return;
    
    setIsPublishing(true);
    setPublishStatus('publishing');

    try {
      // Group changes by document path
      const grouped: Record<string, Record<string, any>> = {};

      for (const change of pendingChanges) {
        const key = `${change.collection}/${change.documentId}`;
        if (!grouped[key]) grouped[key] = {};
        grouped[key][change.field] = change.newValue;
      }

      // Batch update all documents
      const updatePromises = Object.entries(grouped).map(async ([path, fields]) => {
        const [collection, documentId] = path.split('/');
        const docRef = doc(db, collection, documentId);
        
        // Check if document exists
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, fields);
        } else {
          await setDoc(docRef, fields);
        }
      });

      await Promise.all(updatePromises);
      
      setPendingChanges([]);
      setPublishStatus('success');
      
      // Reset status after delay
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (error) {
      console.error('Publish failed:', error);
      setPublishStatus('error');
      setTimeout(() => setPublishStatus('idle'), 4000);
    } finally {
      setIsPublishing(false);
    }
  }, [pendingChanges]);

  return (
    <EditModeContext.Provider
      value={{
        isEditMode,
        isAdmin,
        toggleEditMode,
        pendingChanges,
        addChange,
        removeChange,
        publishAll,
        discardAll,
        isPublishing,
        publishStatus,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}
