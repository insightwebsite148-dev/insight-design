'use client';

import React from 'react';

interface SmartRangeProps {
  label: string;
  value: number | string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export function SmartRange({ label, value, min, max, step = 1, unit = 'px', onChange }: SmartRangeProps) {
  const numericValue = typeof value === 'string' ? parseInt(value) || 0 : value;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <label className="text-[9px] font-black uppercase tracking-widest text-black/40">{label}</label>
        <span className="text-[10px] font-black text-accent bg-accent/5 px-3 py-1 rounded-full uppercase tabular-nums">
          {numericValue}{unit}
        </span>
      </div>
      <div className="relative flex items-center h-4">
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={numericValue} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-[2px] bg-black/[0.05] rounded-full appearance-none cursor-pointer accent-accent hover:bg-black/[0.1] transition-colors"
        />
      </div>
    </div>
  );
}

export function SmartToggle({ label, isActive, onToggle }: { label: string, isActive: boolean, onToggle: (s: boolean) => void }) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-black/[0.03]">
      <label className="text-[9px] font-black uppercase tracking-widest text-black/60">{label}</label>
      <button 
        onClick={() => onToggle(!isActive)}
        className={`w-12 h-6 rounded-full transition-all duration-500 relative ${isActive ? 'bg-accent' : 'bg-black/[0.05]'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${isActive ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}
