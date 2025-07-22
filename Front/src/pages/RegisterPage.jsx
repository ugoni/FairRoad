import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import '../css/AuthPage.css';


function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ email, password, nickname });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

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
            <input id="checkbox" type="checkbox" />
            <label htmlFor="checkbox">개인 정보 수정 동의</label>
          </div>
          <button type="submit" className="btn btn-primary">Sign up</button>
          <div className="divider-with-text">
            <span>Or continue with</span>
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
