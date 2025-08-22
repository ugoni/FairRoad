import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import InterestForm from '../components/InterestForm';
import { register } from '../api/auth';

function SignUpPage() {
  const [step, setStep] = useState(1);
  const [registrationData, setRegistrationData] = useState(null);
  const navigate = useNavigate();

  const handleRegisterSuccess = (data) => {
    setRegistrationData(data);
    setStep(2);
  };

  const handleInterestSubmit = async (interests) => {
    try {
      const finalData = { ...registrationData, interests };
      await register(finalData);
      console.log('Registration successful:', finalData);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      {step === 1 && <RegisterForm onRegisterSuccess={handleRegisterSuccess} />}
      {step === 2 && <InterestForm onInterestSubmit={handleInterestSubmit} />}
    </div>
  );
}

export default SignUpPage;
