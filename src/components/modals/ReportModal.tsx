import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModerationReport } from '../../types';
import { X, Flag, AlertTriangle, Check } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { reportModalData, closeReportModal, submitReport, t } = useApp();

  const [selectedReason, setSelectedReason] = useState<ModerationReport['reason']>('Spam');
  const [submitted, setSubmitted] = useState(false);

  if (!reportModalData) return null;

  const reasons: ModerationReport['reason'][] = [
    'Hate Speech',
    'Harassment',
    'Misinformation',
    'Spam',
    'Copyright',
    'Inappropriate Media',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(selectedReason);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeReportModal();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flag className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">{t('reportPost')}</h3>
          </div>
          <button
            onClick={closeReportModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mb-3">
          Reporting: <strong className="text-white">{reportModalData.name}</strong>
        </p>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-sm font-bold text-white">Report Submitted</h4>
            <p className="text-xs text-slate-400">
              Sent to the Vibegram Indian Moderation Desk for immediate review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              {reasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    selectedReason === r
                      ? 'bg-rose-950/40 border-rose-500/60 text-white font-semibold'
                      : 'bg-slate-800/60 border-white/5 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs">{r}</span>
                  <input
                    type="radio"
                    name="reportReason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="accent-rose-500"
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Submit Report to Mod Desk
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
