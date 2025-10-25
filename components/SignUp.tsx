import React, { useState } from 'react';
import * as db from '../lib/database';

interface SignUpProps {
  onSignUpSuccess: (username: string) => void;
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strengthText, setStrengthText] = useState('');
  const [strengthClass, setStrengthClass] = useState('');
  const [message, setMessage] = useState('');
  const [messageClass, setMessageClass] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    let strength = "Weak";
    let sClass = "weak";

    if (newPassword.length > 6 && /[A-Z]/.test(newPassword) && /\d/.test(newPassword)) {
      strength = "Medium";
      sClass = "medium";
    }

    if (
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /\d/.test(newPassword) &&
      /[@$!%*?&]/.test(newPassword)
    ) {
      strength = "Strong";
      sClass = "strong";
    }
    
    if(newPassword.length > 0) {
        setStrengthText(`Password Strength: ${strength}`);
        setStrengthClass(`strength ${sClass}`);
    } else {
        setStrengthText('');
        setStrengthClass('');
    }
    
    setMessage('');
    setMessageClass('');
  };
  
   const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setMessage('');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage("Password is too weak!");
      setMessageClass("strength weak");
      return;
    }

    const signUpResult = db.signUp(username, password);

    if (signUpResult.success) {
      if (rememberMe) {
        localStorage.setItem("savedUsername", username);
      } else {
        localStorage.removeItem("savedUsername");
      }
      setMessage("✅ Account Created Successfully!");
      setMessageClass("strength strong");
      setTimeout(() => {
        onSignUpSuccess(username);
      }, 1500);
    } else {
      setMessage(signUpResult.message || 'An error occurred.');
      setMessageClass('strength weak');
    }
  };

  return (
    <>
      <style>{`
        .login-page-body {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #ffffff;
          overflow: hidden;
          position: relative;
          font-family: "Poppins", sans-serif;
        }

        .float-bg {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(120px);
          animation: float 10s infinite alternate ease-in-out;
          z-index: 0;
        }

        .float1 {
          background: #60a5fa;
          top: 10%;
          left: 15%;
        }

        .float2 {
          background: #22c55e;
          bottom: 10%;
          right: 15%;
          animation-delay: 3s;
        }

        @keyframes float {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-50px) scale(1.1); }
        }

        .login-page-body .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 90%;
          max-width: 1200px;
          padding: 40px;
          color: #111827;
          position: relative;
          z-index: 2;
        }

        .illustration {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .illustration h1 {
          font-size: 100px;
          font-weight: 800;
          color: #1e3a8a;
          text-shadow: 2px 2px 15px rgba(0,0,0,0.2);
          animation: floatText 4s ease-in-out infinite alternate;
        }

        @keyframes floatText {
          0% { transform: translateY(0); }
          100% { transform: translateY(-15px); }
        }

        .login-box {
          flex: 1;
          background: rgba(255, 255, 255, 0.3);
          padding: 50px;
          border-radius: 16px;
          color: #111827;
          border: 2px solid #d1d5db;
          backdrop-filter: blur(10px);
          max-width: 500px;
        }

        .login-box h2 {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #111827;
        }

        .login-box p {
          color: #374151;
          margin-bottom: 25px;
          font-size: 16px;
        }

        .input-group {
          margin-bottom: 20px;
          position: relative;
        }

        .input-group label {
          display: block;
          font-size: 16px;
          margin-bottom: 8px;
          color: #111827;
          text-align: left;
        }

        .input-group input {
          width: 100%;
          padding: 16px;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          background: rgba(255,255,255,0.8);
          font-size: 16px;
          color: #111827;
        }

        .input-group input:focus {
          border-color: #3b82f6;
        }

        .show-password {
          position: absolute;
          right: 12px;
          top: 50px;
          cursor: pointer;
          font-size: 18px;
          color: #6b7280;
        }

        .strength {
          margin-top: 5px;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
        }

        .weak { color: #ef4444; }
        .medium { color: #f59e0b; }
        .strong { color: #22c55e; }

        .remember {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 16px;
          color: #111827;
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 8px;
          background: #22c55e;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .login-btn:hover {
          background: #16a34a;
        }

        .extra-links {
          text-align: center;
          margin-top: 15px;
          font-size: 16px;
        }

        .extra-links a {
          color: #1e3a8a;
          text-decoration: underline;
          cursor: pointer;
        }

        @media (max-width: 850px) {
          .login-page-body .container {
            flex-direction: column;
            text-align: center;
          }
          .illustration h1 {
            font-size: 70px;
            margin-bottom: 20px;
          }
          .login-box {
            max-width: 100%;
            padding: 40px;
          }
        }
      `}</style>
      <div className="login-page-body">
        <div className="float-bg float1"></div>
        <div className="float-bg float2"></div>

        <div className="container">
          <div className="illustration">
            <h1>SKILLORA</h1>
          </div>

          <div className="login-box">
            <h2>Create an Account</h2>
            <p>Get started with your Skillora account</p>

            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Enter your username" required value={username} onChange={handleUsernameChange} />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type={showPassword ? "text" : "password"} id="password" placeholder="Enter your password" required value={password} onChange={handlePasswordChange} />
                <span className="show-password" onClick={() => setShowPassword(!showPassword)}>👁</span>
                <div id="passwordStrength" className={strengthClass}>{strengthText}</div>
              </div>

              <div className="remember">
                <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <label htmlFor="rememberMe">Remember me</label>
              </div>

              <button className="login-btn" type="submit">Sign Up</button>
            </form>
            
            {message && <p className={`mt-4 text-center font-semibold ${messageClass.replace('strength ', '')}`}>{message}</p>}

            <div className="extra-links">
              <p>Already have an account? <a onClick={onSwitchToLogin}>Log in</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
