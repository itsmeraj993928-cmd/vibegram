import React, { useState, useEffect } from 'react';
import Auth from './Auth';

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('vibegram_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vibegram_user');
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Vibegram</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      <main style={styles.main}>
        <div style={styles.profileCard}>
          <img src={user.avatar || 'https://i.pravatar.cc/150'} alt="Profile" style={styles.avatar} />
          <h2>{user.name || user.username}</h2>
          <p style={styles.username}>@{user.username}</p>
          <p style={styles.bio}>{user.bio || 'Welcome to Vibegram!'}</p>
        </div>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    fontFamily: 'sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    borderBottom: '1px solid #262626',
    backgroundColor: '#121212'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  logoutBtn: {
    backgroundColor: '#ed4956',
    color: '#fff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  profileCard: {
    backgroundColor: '#121212',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #262626',
    textAlign: 'center',
    maxWidth: '350px',
    width: '100%'
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '15px'
  },
  username: {
    color: '#8e8e8e',
    margin: '5px 0'
  },
  bio: {
    marginTop: '10px',
    fontSize: '14px'
  }
};
      
