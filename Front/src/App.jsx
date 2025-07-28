import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InterestPage from './pages/InterestPage';
import './css/App.css';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
      <div className="container">
        <Navbar /> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/interest" element={<InterestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
