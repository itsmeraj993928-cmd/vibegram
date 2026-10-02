import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Conversation } from '../../types';
import {
  MessageCircle,
  Send,
  Mic,
  Image,
  ArrowLeft,
  CheckCheck,
  Smile,
  Phone,
  Video,
  Play,
  Pause,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    currentUser,
    activeConversation,
    setActiveConversation,
    sendMessage,
    t,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;
    sendMessage(activeConversation.id, inputText);
    setInputText('');
  };

  const handleSendVoice = () => {
    if (!activeConversation) return;
    sendMessage(activeConversation.id, '', true);
  };

  if (activeConversation) {
    return (
      <div className="w-full h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] max-h-[820px] rounded-3xl glass-panel border border-white/10 flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setActiveConversation(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="relative">
              <img
                src={activeConversation.participant.avatar}
                alt={activeConversation.participant.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-rose-500"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white truncate">
                {activeConversation.participant.name}
              </h3>
              <p className="text-[10px] text-slate-400 truncate">
                @{activeConversation.participant.username} · {activeConversation.participant.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => alert(`Initiating secure call with ${activeConversation.participant.name}`)}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert(`Starting video stream with ${activeConversation.participant.name}`)}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Video Call"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {/* Greeting banner */}
          <div className="text-center my-3">
            <span className="text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-white/5">
              Encrypted Vibegram Desi Direct Message
            </span>
          </div>

          {/* Past interaction */}
          <div className="flex items-end gap-2 max-w-[80%]">
            <img
              src={activeConversation.participant.avatar}
              alt=""
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
            <div className="bg-slate-800 text-slate-200 text-xs sm:text-sm p-3 rounded-2xl rounded-bl-sm border border-white/5 space-y-1">
              <p>Namaste Rajesh bhai! Hope you are enjoying the Mumbai rains 🌧️</p>
              <span className="text-[9px] text-slate-400 block text-right">10:14 AM</span>
            </div>
          </div>

          <div className="flex items-end justify-end gap-2">
            <div className="max-w-[80%] bg-gradient-to-r from-rose-600 to-orange-500 text-white text-xs sm:text-sm p-3 rounded-2xl rounded-br-sm shadow-md space-y-1">
              <p>Namaste! Yes, the chai stalls at Marine Drive are packed. How is Bengaluru treating you?</p>
              <div className="flex items-center justify-end gap-1 text-[9px] text-rose-200">
                <span>10:20 AM</span>
                <CheckCheck className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Latest simulated message */}
          <div className="flex items-end gap-2 max-w-[80%]">
            <img
              src={activeConversation.participant.avatar}
              alt=""
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
            <div className="bg-slate-800 text-slate-200 text-xs sm:text-sm p-3 rounded-2xl rounded-bl-sm border border-white/5 space-y-2">
              {activeConversation.lastMessage.isAudio ? (
                <div className="flex items-center gap-3 pr-2">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shrink-0"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="space-y-1">
                    <div className="h-3 w-32 bg-slate-700 rounded-full overflow-hidden flex items-center px-1 gap-1">
                      {[40, 70, 30, 90, 60, 80, 50, 95, 45, 60, 85].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}%` }}
                          className={`w-1 rounded-full ${isPlayingAudio ? 'bg-rose-400 animate-pulse' : 'bg-slate-400'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-400">0:14 Desi Voice Note</span>
                  </div>
                </div>
              ) : (
                <p>{activeConversation.lastMessage.text}</p>
              )}
              <span className="text-[9px] text-slate-400 block text-right">
                {activeConversation.lastMessage.timestamp}
              </span>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-white/10 bg-slate-900/90 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleSendVoice}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Send Voice Note"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('typeMessage')}
            className="flex-1 bg-slate-800/80 border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl shadow transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Conversation List View
  return (
    <div className="w-full pb-20 sm:pb-24">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-rose-400" />
          <span>{t('directMessages')}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Connect privately with creators and friends across India
        </p>
      </div>

      {/* Conversations List */}
      <div className="glass-panel rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActiveConversation(conv)}
            className="p-3.5 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <img
                  src={conv.participant.avatar}
                  alt={conv.participant.name}
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-rose-500/50"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm text-white truncate">
                  {conv.participant.name}
                </h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {conv.lastMessage.text}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-[10px] text-slate-400">
                {conv.lastMessage.timestamp}
              </span>
              {conv.unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
