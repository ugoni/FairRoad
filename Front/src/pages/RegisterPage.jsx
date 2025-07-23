import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import '../css/AuthPage.css';
import appleIcon from '../assets/appleIcon.png';
import googleIcon from '../assets/googleIcon.jpg';
import kakaoIcon from '../assets/kakaoIcon.jpg';
import naverIcon from '../assets/naverIcon.png';

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
      navigate('/login');
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
          {showPrivacy && (
            <div className="privacy-overlay" onClick={() => setShowPrivacy(false)}>
              <div
                className="privacy-box"
                onClick={(e) => e.stopPropagation()} >
              <div className="privacy-left">
                <h5>[개인정보 수집 및 이용 동의]</h5>
                <p><strong style={{ fontFamily: 'monospace' }}>FairRoad</strong>는 다음과 같이 개인정보를 수집 및 이용하고 있습니다.</p>
                
                  - 수집 및 이용 목적: 회원 가입, 서비스 제공, 이용자 식별, 부정이용 방지, 공지사항 전달 <br />
                  - 항목: 닉네임, 비밀번호, 이메일주소 <br />
                  - 수집 및 이용 목적: 본인확인, 이용자 식별, 부정이용 방지, 중복가입 방지, 공지사항 전달 <br />
                  - 항목: 이름, 생년월일, 성별, 내외국인정보, 이동통신사정보, 휴대전화번호, 연계정보(CI), 중복가입정보(DI) <br />
                  - 보유 및 이용기간: 회원탈퇴일로부터 30일 (법령에 특별한 규정이 있을 경우 관련 법령에 따라, 부정이용기록은 회원탈퇴일로부터 최대 5년) <br />
                <br />
                <p className="privacy-footer">
                  동의를 거부할 권리가 있으나, 동의를 거부할 경우 회원가입이 불가능 합니다.<br/>
                  외부 계정을 이용하는 경우 이용자가 동의한 범위 내에서만 개인정보를 제공받고 처리합니다.
                </p>
                <p className="privacy-footer">
                  ※ 그 외의 사항 및 자동 수집 정보와 관련된 사항은 개인정보처리방침을 따릅니다.
                </p>
              </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-submit ${isFormValid ? '' : 'disabled'}`}
            disabled={!isFormValid}
          >
            Sign up
          </button>
          <div className="divider-with-text">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button className="social-btn"><img src={googleIcon} alt="googleIcon" /></button>
            <button className="social-btn"><img src={appleIcon} alt="appleIDcon" /></button>
            <button className="social-btn"><img src={naverIcon} alt="naverIcon" /></button>
            <button className="social-btn"><img src={kakaoIcon} alt="kakaoIcon" /></button>
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
