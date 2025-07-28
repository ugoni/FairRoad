import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import '../css/AuthPage.css';
import appleIcon from '../assets/appleIcon.png';
import googleIcon from '../assets/googleIcon.jpg';
import kakaoIcon from '../assets/kakaoIcon.jpg';
import naverIcon from '../assets/naverIcon.png';
import Privacy from '../components/Privacy';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
   const [showPrivacy, setShowPrivacy] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ email, password, nickname });
      navigate('/interest');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  const isFormValid =
    email.trim() !== '' &&
    nickname.trim() !== '' &&
    password.trim() !== '' &&
    password === passwordConfirm &&
    agreed;
  return (
    <div className="auth-container">
      <div className="auth-form">
        <p style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '0' }}>Sign up to Continue</p>
        <p style={{ color: 'grey' }}>Please sign up to start Fair Road's service.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className='mb-3'>
            <label className="form-label">User name</label>
            <input
              type="text"
              className="form-control"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="User name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
          <div className="checkbox-row">
            <input
              id="checkbox"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span onClick={() => setShowPrivacy(!showPrivacy)} 
            style={{ textDecoration: 'underline', color: '#1A9BAD' }}>
                개인정보 수집 및 이용 동의
            </span>
          </div>
          {showPrivacy && <Privacy setShowPrivacy={setShowPrivacy} />}
          <button
            type="submit"
            className={`btn btn-submit ${isFormValid ? '' : 'disabled'}`}
            disabled={!isFormValid}
          >
            Next
          </button>
          <div className="divider-with-text">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button className="social-btn" onClick={() => alert('Google login coming soon!')}>
              <img src={googleIcon} alt="googleIcon" />
            </button>
            <button className="social-btn" onClick={() => alert('Apple login coming soon!')}>
              <img src={appleIcon} alt="appleIDcon" />
            </button>
            <button className="social-btn" onClick={() => alert('Naver login coming soon!')}>
              <img src={naverIcon} alt="naverIcon" />
            </button>
            <button className="social-btn" onClick={() => alert('Kakao login coming soon!')}>
              <img src={kakaoIcon} alt="kakaoIcon" />
            </button>
          </div>
        </form>
      </div>
      <p className="mt-3">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
