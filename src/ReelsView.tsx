import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function ReelsView() {
  const [reels, setReels] = useState<any[]>([]);

  useEffect(() => {
    // Firestore se sirf 'reel' type wali posts fetch karein
    const q = query(collection(db, 'posts'), where('type', '==', 'reel'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleLike = async (reelId: string, likes: string[]) => {
    const user = auth.currentUser;
    if (!user) return alert('Pehle login karein!');

    const reelRef = doc(db, 'posts', reelId);
    const isLiked = likes?.includes(user.uid);

    if (isLiked) {
      await updateDoc(reelRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(reelRef, { likes: arrayUnion(user.uid) });
    }
  };

  return (
    <div className="h-[calc(100vh-110px)] overflow-y-scroll snap-y snap-mandatory bg-black">
      {reels.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Koi Reel upload nahi hui hai.
        </div>
      ) : (
        reels.map((reel) => (
          <div key={reel.id} className="relative h-full w-full snap-start flex items-center justify-center bg-black">
            <video
              src={reel.mediaUrl}
              className="h-full w-full object-cover"
              controls
              autoPlay
              loop
              muted
            />

            {/* Side Action Buttons */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-10 text-white">
              <button onClick={() => handleLike(reel.id, reel.likes || [])} className="flex flex-col items-center">
                <span className="text-2xl">{reel.likes?.includes(auth.currentUser?.uid) ? '❤️' : '🤍'}</span>
                <span className="text-xs font-bold">{reel.likes?.length || 0}</span>
              </button>
              <div className="flex flex-col items-center">
                <span className="text-2xl">💬</span>
                <span className="text-xs font-bold">{reel.comments?.length || 0}</span>
              </div>
            </div>

            {/* User Details */}
            <div className="absolute bottom-4 left-4 z-10 text-white max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={reel.userImage || 'https://via.placeholder.com/40'}
                  className="w-8 h-8 rounded-full border border-white"
                  alt="avatar"
                />
                <span className="font-bold text-sm">{reel.username}</span>
              </div>
              <p className="text-sm line-clamp-2">{reel.caption}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
