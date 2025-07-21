import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../api/auth';
import './AuthPage.css';
import slogan from '../assets/slogan.png';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      console.log('Login successful:', response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

return (
  <div className="auth-container">
    <div className="auth-form">
      <img src={slogan} alt="Slogan" style={{ width: '100%', marginBottom: '20px' }} />
      <p style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '0' }}>Sign in to Continue</p>
      <p style={{ color: 'grey' }}>Please sign in to start Fair Road's service.</p>
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
        <button type="submit" className="btn btn-primary">Sign in</button>
      </form>
          <div className="divider-with-text">
            <span>Or continue with</span>
          </div>
    </div>
    <p className="mt-3 text-center">
      Don't have an account? <Link to="/register">Sign up</Link>
    </p>
  </div>
);

}

export default LoginPage;
