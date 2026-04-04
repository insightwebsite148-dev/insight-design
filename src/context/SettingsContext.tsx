'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';

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
    // Single global listener for settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (snapshot) => {
      if (snapshot.exists()) setSettings(snapshot.data());
    });

    // Single global listener for categories
    const unsubCategories = onSnapshot(query(collection(db, 'categories'), orderBy('name', 'asc')), (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(cats);
    });

    // Single global listener for projects
    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    });

    return () => {
      unsubSettings();
      unsubCategories();
      unsubProjects();
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
