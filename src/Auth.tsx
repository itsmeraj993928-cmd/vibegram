import React, { useState } from 'react';

interface AuthProps {
  onLogin: (user: any) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!formData.email || !formData.password || !formData.username) {
        alert('Kripya saari details bharein!');
        return;
      }
      const user = {
        name: formData.fullName || formData.username,
        username: formData.username,
        email: formData.email,
        bio: 'Hey there! I am using Vibegram.',
        avatar: 'https://i.pravatar.cc/150?img=12'
      };
      localStorage.setItem('vibegram_user', JSON.stringify(user));
      onLogin(user);
    } else {
      const savedUser = localStorage.getItem('vibegram_user');
      if (savedUser) {
        onLogin(JSON.parse(savedUser));
      } else {
        const user = {
          name: formData.username || 'User',
          username: formData.username || 'user123',
          email: formData.username + '@vibegram.com',
          bio: 'Vibegram Explorer ✨',
          avatar: 'https://i.pravatar.cc/150?img=33'
        };
        localStorage.setItem('vibegram_user', JSON.stringify(user));
        onLogin(user);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Vibegram</h1>
        <p style={styles.subtitle}>
          {isSignUp ? 'Sign up to see photos and videos from your friends.' : 'Log in to your account'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </>
          )}

          {!isSignUp && (
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine}></span>
        </div>

        <div style={styles.switchBox}>
          <p>
            {isSignUp ? "Have an account? " : "Don't have an account? "}
            <span
              style={styles.switchText}
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: '350px',
    padding: '30px 20px',
    backgroundColor: '#121212',
    borderRadius: '12px',
    border: '1px solid #262626',
    textAlign: 'center'
  },
  logo: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '10px',
    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: { color: '#a8a8a8', fontSize: '14px', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #363636',
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none'
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0095f6',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  divider: { display: 'flex', alignItems: 'center', margin: '20px 0' },
  dividerLine: { flex: 1, height: '1px', backgroundColor: '#262626' },
  dividerText: { padding: '0 10px', color: '#8e8e8e', fontSize: '12px', fontWeight: 'bold' },
  switchBox: { fontSize: '14px', color: '#a8a8a8' },
  switchText: { color: '#0095f6', fontWeight: 'bold', cursor: 'pointer' }
};
        
