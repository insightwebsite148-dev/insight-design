'use client';

import React from 'react';
import AdminImageUploader from '../shared/AdminImageUploader';

interface ProjectImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ProjectImageField({ label, value, onChange, folder = 'projects' }: ProjectImageFieldProps) {
  return (
    <div className="py-10 border-b-2 border-black/5 last:border-0">
      <AdminImageUploader 
        label={label}
        value={value}
        onChange={onChange}
        folder={folder}
      />
    </div>
  );
}
