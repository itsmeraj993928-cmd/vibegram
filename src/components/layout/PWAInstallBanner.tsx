import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed or dismissed, hide banner
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <>
      <div className="w-full bg-gradient-to-r from-rose-950/70 via-slate-900 to-indigo-950/70 border-b border-rose-500/20 px-3 py-2 text-xs flex items-center justify-between gap-3 text-slate-200">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center shrink-0 shadow">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white truncate flex items-center gap-1">
              Install Vibegram App
              <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1 rounded border border-amber-500/20">
                Fast & Offline Ready
              </span>
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              Install directly to home screen for the full native Indian social experience.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-sm transition-colors text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-white/10 transition-colors text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Install on iOS
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white">Install Vibegram on iPhone</h3>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0">1</span>
                <span>Tap the <strong>Share</strong> icon in the Safari toolbar at the bottom.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0">2</span>
                <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0">3</span>
                <span>Tap <strong>Add</strong> in the top right corner. Vibegram will launch full screen!</span>
              </p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
