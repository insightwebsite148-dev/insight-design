'use client';

interface ColorInputProps {
  label: string;
  desc?: string;
  value: string;
  onChange: (val: string) => void;
}

export default function ColorInput({ label, desc, value, onChange }: ColorInputProps) {
  return (
    <div className="space-y-1.5 font-bold">
      <div className="flex justify-between items-end">
        <div>
          <label className="text-[11px] font-black uppercase tracking-normal block text-black/80">{label}</label>
          {desc && <p className="text-[8px] text-muted-foreground uppercase">{desc}</p>}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-[10px] font-mono border-b border-border focus:border-accent outline-none w-20 text-right"
        />
      </div>
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 bg-transparent border-none cursor-pointer"
        />
        <div
          className="flex-1 h-2.5 rounded-full border border-border shadow-inner"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
}
