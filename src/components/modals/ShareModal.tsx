import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Share2, Copy, Check, MessageSquare, Send } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { shareModalData, closeShareModal, conversations, sendMessage, t } = useApp();
  const [copied, setCopied] = useState(false);
  const [sentInDm, setSentInDm] = useState<string | null>(null);

  if (!shareModalData) return null;

  const shareUrl = `${window.location.origin}/post/${shareModalData.id}`;
  const shareText = `Check out this vibe by ${shareModalData.user.name} on Vibegram 🇮🇳: "${shareModalData.caption.slice(0, 80)}..."\n${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleSendDM = (convId: string, partnerName: string) => {
    sendMessage(convId, `Check out this post: ${shareUrl}`);
    setSentInDm(partnerName);
    setTimeout(() => setSentInDm(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-rose-400" />
            <span>{t('share')}</span>
          </h3>
          <button
            onClick={closeShareModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Preview Miniature */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-white/5 mb-4">
          <img
            src={shareModalData.mediaUrls[0]}
            alt=""
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {shareModalData.user.name}
            </p>
            <p className="text-[11px] text-slate-400 line-clamp-1">{shareModalData.caption}</p>
          </div>
        </div>

        {/* Primary Share Options */}
        <div className="space-y-2 mb-4">
          {/* WhatsApp Share Button */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <span className="text-sm">💬</span>
            <span>{t('shareViaWhatsApp')}</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">{t('linkCopied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t('copyLink')}</span>
              </>
            )}
          </button>
        </div>

        {/* Share in Vibegram Direct Chat */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Send via Vibegram Chat
          </h4>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {conversations.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={c.participant.avatar}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <span className="text-xs text-slate-200 font-medium truncate">
                    {c.participant.name}
                  </span>
                </div>
                <button
                  onClick={() => handleSendDM(c.id, c.participant.name)}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold"
                >
                  Send
                </button>
              </div>
            ))}
          </div>

          {sentInDm && (
            <p className="text-[11px] text-emerald-400 text-center mt-2 font-medium">
              Sent to {sentInDm} in chat!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
