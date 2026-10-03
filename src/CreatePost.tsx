import React, { useState } from 'react';
import { db, storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CreatePostProps {
  onClose: () => void;
}

export default function CreatePost({ onClose }: CreatePostProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState<'post' | 'reel'>('post');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Kripya ek photo ya video select karein!');

    const user = auth.currentUser;
    if (!user) return alert('Pehle login karein!');

    setLoading(true);

    try {
      // 1. Storage me file upload karein
      const storageRef = ref(storage, `${postType}s/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. Firestore Database me post/reel Document add karein
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'User',
        userImage: user.photoURL || 'https://via.placeholder.com/150',
        mediaUrl: downloadURL,
        caption: caption,
        type: postType,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      alert('Post successfully upload ho gaya!');
      onClose();
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      alert('Upload mein dikkat aayi: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Naya Post / Reel Banayein</h2>
          <button onClick={onClose} className="text-gray-400 text-xl">✕</button>
        </div>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          {/* Post Type Selector */}
          <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
            <button
              type="button"
              className={`flex-1 py-1 rounded-md text-sm ${postType === 'post' ? 'bg-blue-600' : 'text-gray-400'}`}
              onClick={() => setPostType('post')}
            >
              📷 Photo
            </button>
            <button
              type="button"
              className={`flex-1 py-1 rounded-md text-sm ${postType === 'reel' ? 'bg-blue-600' : 'text-gray-400'}`}
              onClick={() => setPostType('reel')}
            >
              🎬 Reel Video
            </button>
          </div>

          {/* File Input */}
          <input
            type="file"
            accept={postType === 'post' ? 'image/*' : 'video/*'}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white"
            required
          />

          {/* Caption Input */}
          <textarea
            placeholder="Caption likhein..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="bg-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Upload ho raha hai...' : 'Share Karein'}
          </button>
        </form>
      </div>
    </div>
  );
  }
