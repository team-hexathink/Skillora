import React, { useState, useEffect } from 'react';
import * as db from '../lib/database';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
  onSwitchToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageClass, setMessageClass] = useState('');

  useEffect(() => {
    const savedUsername = typeof window !== 'undefined' ? localStorage.getItem('savedUsername') : null;
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setMessage('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loginResult = db.login(username, password);

    if (loginResult.success) {
      if (rememberMe) {
        localStorage.setItem('savedUsername', username);
      } else {
        localStorage.removeItem('savedUsername');
      }
      setMessage('✅ Login Successful!');
      setMessageClass('strong');
      setTimeout(() => {
        onLoginSuccess(username);
      }, 1000);
    } else {
      setMessage(loginResult.message || 'Invalid credentials.');
      setMessageClass('weak');
    }
  };

  // small keyboard accessibility for the eye icon
  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const onShowPasswordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleShowPassword();
    }
  };

  return (
    <>
      <style>{`
  :root {
    /* Updated color tokens for maximum visibility */
    --bg: #ffffff;
    --accent1: #60a5fa;
    --accent2: #22c55e;
    --text-default: #111827;
    --text-light: #f9fafb;
    --primary: #1e3a8a;
    --text-shadow: 2px 2px 15px rgba(0,0,0,0.2);
    --card-bg: rgba(255, 255, 255, 0.85);
    --border: #9ca3af;
    --muted-paragraph: #1f2937;
    --input-bg: rgba(255, 255, 255, 0.9);
    --accent: #2563eb;
    --muted-text: #374151;
    --status-rejected: #ef4444;
    --status-interviewing: #f59e0b;
    --status-offered: #16a34a;
    --btn-success: #22c55e;
    --btn-success-hover: #16a34a;
  }

  .login-page-body {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--bg);
    overflow: hidden;
    position: relative;
    font-family: "Poppins", sans-serif;
    color: var(--text-default);
  }

  .float-bg {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    filter: blur(120px);
    animation: float 10s infinite alternate ease-in-out;
    z-index: 0;
    opacity: 0.6;
  }

  .float1 { background: var(--accent1); top: 10%; left: 15%; }
  .float2 { background: var(--accent2); bottom: 10%; right: 15%; animation-delay: 3s; }

  @keyframes float {
    0% { transform: translateY(0) scale(1); }
    100% { transform: translateY(-50px) scale(1.1); }
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    max-width: 1200px;
    padding: 40px;
    position: relative;
    z-index: 2;
  }

  .illustration h1 {
    font-size: 100px;
    font-weight: 800;
    color: var(--primary);
    text-shadow: var(--text-shadow);
    animation: floatText 4s ease-in-out infinite alternate;
  }

  @keyframes floatText {
    0% { transform: translateY(0); }
    100% { transform: translateY(-15px); }
  }

  .login-box {
    flex: 1;
    background: var(--card-bg);
    padding: 50px;
    border-radius: 16px;
    color: var(--text-default);
    border: 2px solid var(--border);
    backdrop-filter: blur(10px);
    max-width: 500px;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  }

  .login-box h2 {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-default);
  }

  .login-box p {
    color: var(--muted-paragraph);
  }

  .input-group {
    margin-bottom: 20px;
    position: relative;
  }

  .input-group label {
    display: block;
    font-size: 16px;
    margin-bottom: 8px;
    color: var(--text-default);
  }

  .input-group input {
    width: 100%;
    padding: 16px;
    border: 2px solid var(--border);
    border-radius: 8px;
    outline: none;
    background: var(--input-bg);
    font-size: 16px;
    color: var(--text-default);
  }

  .input-group input::placeholder {
    color: var(--muted-text);
    opacity: 0.9;
  }

  .input-group input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  .show-password {
    position: absolute;
    right: 12px;
    top: 50px;
    cursor: pointer;
    font-size: 18px;
    color: var(--muted-text);
    user-select: none;
  }

  .remember {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    font-size: 16px;
    color: var(--text-default);
  }

  .login-btn {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 8px;
    background: var(--btn-success);
    color: var(--text-light);
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
  }

  .login-btn:hover {
    background: var(--btn-success-hover);
  }

  .weak { color: var(--status-rejected); }
  .medium { color: var(--status-interviewing); }
  .strong { color: var(--status-offered); }

  .extra-links {
    text-align: center;
    margin-top: 15px;
    font-size: 16px;
    color: var(--text-default);
  }

  .extra-links a {
    color: var(--primary);
    text-decoration: underline;
    cursor: pointer;
  }

  @media (max-width: 850px) {
    .container { flex-direction: column; text-align: center; }
    .illustration h1 { font-size: 70px; margin-bottom: 20px; }
    .login-box { max-width: 100%; padding: 40px; }
  }
`}</style>

      <div className="login-page-body">
        <div className="float-bg float1" aria-hidden="true"></div>
        <div className="float-bg float2" aria-hidden="true"></div>

        <div className="container">
          <div className="illustration">
            <h1>SKILLORA</h1>
          </div>

          <div className="login-box">
            <h2>Welcome Back</h2>
            <p>Login to your Skillora account</p>

            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span
                  className="show-password"
                  role="button"
                  tabIndex={0}
                  onClick={toggleShowPassword}
                  onKeyDown={onShowPasswordKeyDown}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>

              <div className="remember">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>

              <button className="login-btn" type="submit">Log In</button>
            </form>

            {message && (
              <p className={`mt-4 text-center font-semibold ${messageClass}`}>
                {message}
              </p>
            )}

            <div className="extra-links">
              <p><a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a></p>
              <p>
                Don't have an account?{' '}
                <a
                  href="#signup"
                  onClick={(e) => {
                    e.preventDefault();
                    onSwitchToSignUp();
                  }}
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
