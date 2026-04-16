'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface SettingsContextType {
  settings: any;
  categories: any[];
  projects: any[];
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ 
  children, 
  initialSettings = {},
  initialCategories = [],
  initialProjects = []
}: { 
  children: ReactNode; 
  initialSettings?: any;
  initialCategories?: any[];
  initialProjects?: any[];
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [categories, setCategories] = useState(initialCategories);
  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubSettings: () => void;
    let unsubCategories: () => void;
    let unsubProjects: () => void;

    // Only subscribe to live real-time updates if an admin is logged in
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      // Clean up previous listeners if any
      if (unsubSettings) unsubSettings();
      if (unsubCategories) unsubCategories();
      if (unsubProjects) unsubProjects();

      if (user) {
        setLoading(true);
        // Admin user logged in: Attach real-time snapshot listeners
        unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (snapshot) => {
          if (snapshot.exists()) setSettings(snapshot.data());
        });

        unsubCategories = onSnapshot(query(collection(db, 'categories'), orderBy('name', 'asc')), (snapshot) => {
          const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCategories(cats);
        });

        unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProjects(data);
          setLoading(false);
        });
      }
    });

    return () => {
      unsubAuth();
      if (unsubSettings) unsubSettings();
      if (unsubCategories) unsubCategories();
      if (unsubProjects) unsubProjects();
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, categories, projects, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
