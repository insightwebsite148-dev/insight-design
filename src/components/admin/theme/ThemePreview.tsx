'use client';

interface ThemePreviewProps {
  theme: Record<string, string>;
}

export default function ThemePreview({ theme }: ThemePreviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-stone-900 text-white p-8 rounded-sm shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">Live Preview</h4>

          {/* Page Preview */}
          <div className="p-6 space-y-4 border transition-colors duration-500" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
            <h5 className="text-xl font-bold uppercase tracking-tighter" style={{ color: theme.primary }}>Heading</h5>
            <p className="text-xs" style={{ color: theme.muted }}>Body text on the background surface.</p>
            <p className="text-[10px]" style={{ color: theme.mutedForeground }}>Caption text / placeholder.</p>
            <div className="flex gap-3 pt-2">
              <div className="px-5 py-2 text-[8px] font-bold uppercase tracking-widest" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>Primary</div>
              <div className="px-5 py-2 text-[8px] font-bold uppercase tracking-widest" style={{ backgroundColor: theme.accent, color: theme.accentForeground }}>Accent</div>
              <div className="px-5 py-2 text-[8px] font-bold uppercase tracking-widest border" style={{ backgroundColor: theme.surface, color: theme.foreground, borderColor: theme.border }}>Surface</div>
            </div>
          </div>

          {/* Card Preview */}
          <div className="p-5 border" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.cardForeground }}>Card Component</p>
            <p className="text-[8px] mt-1" style={{ color: theme.muted }}>Inside a card surface</p>
          </div>

          {/* Status Preview */}
          <div className="flex gap-3">
            <span className="px-3 py-1 text-[7px] font-bold uppercase tracking-widest text-white rounded-sm" style={{ backgroundColor: theme.success }}>Success</span>
            <span className="px-3 py-1 text-[7px] font-bold uppercase tracking-widest text-white rounded-sm" style={{ backgroundColor: theme.warning }}>Warning</span>
            <span className="px-3 py-1 text-[7px] font-bold uppercase tracking-widest text-white rounded-sm" style={{ backgroundColor: theme.danger }}>Danger</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: theme.accent + '30' }} />
      </div>

      <div className="p-6 bg-surface border-l-4 border-accent flex items-start">
        <p className="text-[10px] text-muted leading-relaxed italic">
          "Color is the skin of architecture. These 18 tokens form a complete design language — from core identity to feedback states — ensuring total visual consistency across every page and component."
        </p>
      </div>
    </div>
  );
}
