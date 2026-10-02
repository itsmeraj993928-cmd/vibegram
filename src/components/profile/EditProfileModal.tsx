import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, MapPin, Globe, Sparkles, Check } from 'lucide-react';

export const EditProfileModal: React.FC = () => {
  const { isEditProfileOpen, setIsEditProfileOpen, currentUser, updateCurrentUserProfile, t } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [hindiName, setHindiName] = useState(currentUser.hindiName || '');
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [website, setWebsite] = useState(currentUser.website || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);

  if (!isEditProfileOpen) return null;

  const presetAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name,
      hindiName,
      bio,
      location,
      website,
      avatar,
    });
    setIsEditProfileOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">{t('editProfile')}</h3>
          <button
            onClick={() => setIsEditProfileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Avatar
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {presetAvatars.map((url, i) => (
                <div
                  key={i}
                  onClick={() => setAvatar(url)}
                  className={`relative w-12 h-12 rounded-full cursor-pointer shrink-0 border-2 transition-all ${
                    avatar === url ? 'border-rose-500 scale-105' : 'border-white/10 opacity-70'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full rounded-full object-cover" />
                  {avatar === url && (
                    <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name (English)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              नाम (हिंदी / Devanagari)
            </label>
            <input
              type="text"
              value={hindiName}
              onChange={(e) => setHindiName(e.target.value)}
              placeholder="जैसे: राजेश मेहता"
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              City & State (India)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, Maharashtra"
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Website / Portfolio
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};
