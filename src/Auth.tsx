import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthProps {
  onLogin: (user: any) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Real Firebase Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Fetch user metadata from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        let userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: email.split('@')[0],
          name: email.split('@')[0],
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
        };

        if (userDoc.exists()) {
          userData = { ...userData, ...userDoc.data() };
        }

        localStorage.setItem('vibegram_user', JSON.stringify(userData));
        onLogin(userData);
      } else {
        // Real Firebase Sign Up
        if (!username.trim() || !fullName.trim()) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const newUserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: username.trim().toLowerCase(),
          name: fullName.trim(),
          bio: 'Vibegram Explorer ✨',
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username.trim()}`
        };

        // Save profile to Firestore Database
        await setDoc(doc(db, 'users', firebaseUser.uid), newUserProfile);

        localStorage.setItem('vibegram_user', JSON.stringify(newUserProfile));
        onLogin(newUserProfile);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Vibegram</h1>
        <p style={styles.subtitle}>
          {isLogin ? 'Sign in to see photos and videos from your friends.' : 'Sign up to see photos and videos from your friends.'}
        </p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div style={styles.toggleBox}>
          <span>{isLogin ? "Don't have an account?" : "Have an account?"}</span>
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={styles.toggleBtn}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#000000',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    backgroundColor: '#121212',
    border: '1px solid #262626',
    borderRadius: '12px',
    padding: '30px 24px',
    width: '100%',
    maxWidth: '350px',
    textAlign: 'center'
  },
  logo: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#a8a8a8',
    fontSize: '13px',
    margin: '0 0 20px 0',
    lineHeight: '1.4'
  },
  errorBox: {
    backgroundColor: 'rgba(237, 73, 86, 0.15)',
    color: '#ed4956',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '12px',
    marginBottom: '15px',
    border: '1px solid rgba(237, 73, 86, 0.3)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #363636',
    borderRadius: '6px',
    padding: '10px 12px',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none'
  },
  submitBtn: {
    backgroundColor: '#0095f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '6px'
  },
  toggleBox: {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #262626',
    fontSize: '13px',
    color: '#a8a8a8',
    display: 'flex',
    justifyContent: 'center',
    gap: '6px'
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#0095f6',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '13px'
  }
};
    
