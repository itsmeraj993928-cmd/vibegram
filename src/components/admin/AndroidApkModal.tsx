import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Smartphone, Terminal, Check, Copy, Shield, Layers, FileCode } from 'lucide-react';

export const AndroidApkModal: React.FC = () => {
  const { isAndroidApkModalOpen, setIsAndroidApkModalOpen } = useApp();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isAndroidApkModalOpen) return null;

  const copyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Production Web Assets Build',
      command: 'npm run build',
      desc: 'Builds optimized, compressed client bundle into /dist with PWA service worker.',
    },
    {
      title: 'Step 2: Initialize Native Android Container (Capacitor)',
      command: 'npx cap add android',
      desc: 'Generates the native Gradle Android project using in.vibegram.app package.',
    },
    {
      title: 'Step 3: Sync Assets and Web Manifest into Android Studio',
      command: 'npx cap sync android',
      desc: 'Copies icons, plugins, and splash screens into Android res/ folders.',
    },
    {
      title: 'Step 4: Compile Release APK or AAB',
      command: 'npx cap open android',
      desc: 'Opens Android Studio -> Build -> Build Bundle(s) / APK(s) -> Build APK.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/80 to-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Android APK Packaging Architecture</h3>
              <p className="text-[10px] text-indigo-300">Ready for Google Play Store & Indian OEM stores</p>
            </div>
          </div>
          <button
            onClick={() => setIsAndroidApkModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Architecture Highlights */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                <span>Package ID</span>
              </div>
              <p className="font-mono text-slate-200">in.vibegram.app</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                <Layers className="w-3.5 h-3.5" />
                <span>Capacitor Config</span>
              </div>
              <p className="font-mono text-slate-200">capacitor.config.json</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <FileCode className="w-3.5 h-3.5 text-rose-400" />
              <span>Android Ready Optimizations Included:</span>
            </div>
            <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1">
              <li>PWA Manifest with 192px and 512px maskable squircle icons</li>
              <li>Safe area insets (`env(safe-area-inset-bottom)`) for notch and bottom bar</li>
              <li>Service worker caching for lightning offline launching</li>
              <li>Low-Data Mode for India's diverse 2G/3G/4G bandwidth conditions</li>
              <li>TWA (Trusted Web Activity) / Bubblewrap and Capacitor dual support</li>
            </ul>
          </div>

          {/* Step by step commands */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Step-by-Step Terminal Commands to Build APK:
            </h4>
            {steps.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-xs">{step.title}</span>
                  <button
                    onClick={() => copyCommand(step.command, idx)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Copy command"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-white/5 font-mono text-[11px] text-rose-400 flex items-center justify-between">
                  <span>$ {step.command}</span>
                </div>
                <p className="text-[10px] text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
