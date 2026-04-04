'use client';

interface CursorLabProps {
  settings: any;
  setSettings: (s: any) => void;
}

import { useAdminLanguage } from '@/context/AdminLanguageContext';

export default function CursorLab({ settings, setSettings }: CursorLabProps) {
  const { lang, t } = useAdminLanguage();
  const c = t.cursor;

  return (
    <div className={`bg-white border border-border overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-t-accent/20 border-t-4 ${lang === 'ar' ? 'font-sans' : ''}`}>
      <div className="bg-slate-50 px-8 py-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">{c.title}</h3>
          <p className="text-[11px] text-slate-500 mt-1">{c.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-600">{c.enabledLabel}</span>
          <button 
            onClick={() => setSettings({...settings, cursorEnabled: !settings.cursorEnabled})}
            className={`w-10 h-5 rounded-full transition-colors relative ${settings.cursorEnabled ? 'bg-accent' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.cursorEnabled ? (lang === 'ar' ? 'left-1' : 'right-1') : (lang === 'ar' ? 'right-1' : 'left-1')}`} />
          </button>
        </div>
      </div>

      <div className="p-10 space-y-12">
        {/* Section 1: Visual Aesthetics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent" />
              {c.palettesLabel}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500">{c.innerDot}</span>
                <input type="color" value={settings.cursorInnerColor} onChange={(e) => setSettings({...settings, cursorInnerColor: e.target.value})} className="w-full h-8 bg-transparent border border-slate-200 cursor-pointer p-0.5" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500">{c.outerRing}</span>
                <input type="color" value={settings.cursorOuterColor} onChange={(e) => setSettings({...settings, cursorOuterColor: e.target.value})} className="w-full h-8 bg-transparent border border-slate-200 cursor-pointer p-0.5" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent" />
              {c.blendLabel}
            </label>
            <select 
              value={settings.cursorBlend}
              onChange={(e) => setSettings({...settings, cursorBlend: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm focus:border-accent"
            >
              <option value="difference">{c.blends.difference}</option>
              <option value="exclusion">{c.blends.exclusion}</option>
              <option value="overlay">{c.blends.overlay}</option>
              <option value="normal">{c.blends.normal}</option>
            </select>
            <p className="text-[10px] text-slate-400">{c.blendDesc}</p>
          </div>

          <div className="space-y-6">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent" />
              {c.morphologyLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['circle', 'square', 'pill'].map((shape) => (
                <button
                  key={shape}
                  onClick={() => setSettings({...settings, cursorShape: shape})}
                  className={`py-3 text-[10px] font-bold border transition-all rounded-md ${(settings as any).cursorShape === shape ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-accent'}`}
                >
                  {(c.shapes as any)[shape]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Physics & Dimensions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-10 border-t border-slate-100">
          <div className="space-y-8">
            <label className="text-[11px] font-bold text-slate-700">{c.physicsTitle}</label>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                  <span>{c.stiffness}</span>
                  <span>{settings.cursorStiff}</span>
                </div>
                <input type="range" min="50" max="1000" step="10" value={settings.cursorStiff} onChange={(e) => setSettings({...settings, cursorStiff: e.target.value})} className="w-full accent-accent h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                  <span>{c.smoothness}</span>
                  <span>{settings.cursorDamp}</span>
                </div>
                <input type="range" min="5" max="100" step="5" value={settings.cursorDamp} onChange={(e) => setSettings({...settings, cursorDamp: e.target.value})} className="w-full accent-accent h-1.5" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <label className="text-[11px] font-bold text-slate-700">{c.dimensionsTitle}</label>
            <div className="grid grid-cols-2 gap-8">
              <div>
                 <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                  <span>{c.innerSize}</span>
                  <span>{settings.cursorInnerSize}px</span>
                </div>
                <input type="range" min="1" max="20" step="1" value={settings.cursorInnerSize} onChange={(e) => setSettings({...settings, cursorInnerSize: e.target.value})} className="w-full accent-slate-800 h-1.5" />
              </div>
              <div>
                 <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                  <span>{c.outerSize}</span>
                  <span>{settings.cursorOuterSize}px</span>
                </div>
                <input type="range" min="10" max="100" step="2" value={settings.cursorOuterSize} onChange={(e) => setSettings({...settings, cursorOuterSize: e.target.value})} className="w-full accent-slate-800 h-1.5" />
              </div>
              <div>
                 <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                  <span>{c.hoverScale}</span>
                  <span>{settings.cursorHoverScale}x</span>
                </div>
                <input type="range" min="1" max="5" step="0.1" value={settings.cursorHoverScale} onChange={(e) => setSettings({...settings, cursorHoverScale: e.target.value})} className="w-full accent-accent h-1.5" />
              </div>
              <div>
                 <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                  <span>{c.borderWidth}</span>
                  <span>{settings.cursorBorderWidth}px</span>
                </div>
                <input type="range" min="0.5" max="10" step="0.5" value={settings.cursorBorderWidth} onChange={(e) => setSettings({...settings, cursorBorderWidth: e.target.value})} className="w-full accent-accent h-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
