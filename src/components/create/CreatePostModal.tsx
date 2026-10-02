import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Image,
  Video,
  MapPin,
  Hash,
  Users,
  Sparkles,
  Upload,
  Check,
} from 'lucide-react';

export const CreatePostModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    communities,
    createNewPost,
    createNewVibe,
    lowDataMode,
    t,
  } = useApp();

  const [postType, setPostType] = useState<'photo' | 'vibe'>('photo');
  const [caption, setCaption] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, Maharashtra');
  const [selectedMedia, setSelectedMedia] = useState('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1080&auto=format&fit=crop&q=80');
  const [customMediaUrl, setCustomMediaUrl] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateModalOpen) return null;

  const presetImages = [
    {
      title: 'Varanasi Ghats',
      url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1080&auto=format&fit=crop&q=80',
    },
    {
      title: 'Marine Drive Sunset',
      url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1080&auto=format&fit=crop&q=80',
    },
    {
      title: 'Jaipur Hawa Mahal',
      url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1080&auto=format&fit=crop&q=80',
    },
    {
      title: 'Bengaluru Tech Corridor',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1080&auto=format&fit=crop&q=80',
    },
    {
      title: 'Acoustic Sitar & Studio',
      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1080&auto=format&fit=crop&q=80',
    },
    {
      title: 'Street Food & Spices',
      url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1080&auto=format&fit=crop&q=80',
    },
  ];

  const presetCities = [
    'Mumbai, Maharashtra',
    'Bengaluru, Karnataka',
    'Delhi NCR',
    'Jaipur, Rajasthan',
    'Kolkata, West Bengal',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Varanasi, Uttar Pradesh',
  ];

  const suggestedTags = ['#DesiVibes', '#IncredibleIndia', '#ChaiPeCharcha', '#MumbaiDiaries', '#TechBharat', '#StartupIndia'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const media = customMediaUrl.trim() || selectedMedia;
      if (postType === 'photo') {
        createNewPost({
          caption,
          mediaUrl: media,
          location: selectedLocation,
          hashtags: ['#Vibegram', '#DesiVibe'],
          communityId: selectedCommunityId || undefined,
        });
      } else {
        createNewVibe({
          caption,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          audioTitle: 'Original Desi Track',
          hashtags: ['#DesiReels', '#Vibegram'],
        });
      }
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {postType === 'photo' ? t('createPostTitle') : t('createVibeTitle')}
              </h3>
              <p className="text-[10px] text-slate-400">Share with the Vibegram Indian community</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Type Selector (Photo vs Video) */}
        <div className="p-3 bg-slate-950/60 border-b border-white/5 flex gap-2">
          <button
            type="button"
            onClick={() => setPostType('photo')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              postType === 'photo'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>{t('photoPost')}</span>
          </button>
          <button
            type="button"
            onClick={() => setPostType('vibe')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              postType === 'vibe'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{t('videoPost')}</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Caption Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('writeCaption')}
            </label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening in your city or mind today? (Hindi/Hinglish/English)..."
              className="w-full bg-slate-800/80 border border-white/10 rounded-2xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* Quick Hashtag Insertion */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">
              Quick Hashtags:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setCaption((prev) => `${prev} ${tag}`)}
                  className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-[11px] text-rose-300 border border-rose-500/20"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Media Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('selectMedia')}
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {presetImages.map((img) => (
                <div
                  key={img.title}
                  onClick={() => {
                    setSelectedMedia(img.url);
                    setCustomMediaUrl('');
                  }}
                  className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedMedia === img.url && !customMediaUrl
                      ? 'border-rose-500 ring-2 ring-rose-500/40 scale-102'
                      : 'border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-[9px] font-semibold text-white drop-shadow truncate pr-1">
                    {img.title}
                  </span>
                  {selectedMedia === img.url && !customMediaUrl && (
                    <div className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-600 text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Custom URL Input */}
            <input
              type="url"
              value={customMediaUrl}
              onChange={(e) => setCustomMediaUrl(e.target.value)}
              placeholder="Or paste external image/video URL..."
              className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Indian Location Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {t('locationTag')}
              </span>
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            >
              {presetCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Community Adda Picker (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Post to Desi Adda (Optional)
              </span>
            </label>
            <select
              value={selectedCommunityId}
              onChange={(e) => setSelectedCommunityId(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            >
              <option value="">No Adda (Personal Profile Only)</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Low-data note */}
          {lowDataMode && (
            <p className="text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
              {t('lowDataCompressionNotice')}
            </p>
          )}

          {/* Publish Button */}
          <button
            type="submit"
            disabled={isSubmitting || !caption.trim()}
            className="w-full py-3 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/25 transition-all"
          >
            {isSubmitting ? t('publishing') : t('publishNow')}
          </button>
        </form>
      </div>
    </div>
  );
};
