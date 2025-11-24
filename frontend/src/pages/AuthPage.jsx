import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; 
import LoginPage from './Login';
import Signup from '../components/Signup';
import './Login.css';

const AuthPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set the panel active state based on the current route
    setIsRightPanelActive(location.pathname === '/signup');
  }, [location.pathname]);

  const handleBackButtonClick = () => {
    navigate('/'); 
  };

  return (
    <div className={`auth-super-container${isRightPanelActive ? ' right-panel-active' : ''}`}>
      {/* Login Form */}
      <div className="form-container sign-in-container">
        <button 
          className="lucid-back-button" 
          onClick={handleBackButtonClick} 
        >
          <ArrowLeft size={24} /> 
        </button>
        <LoginPage setIsActive={() => setIsRightPanelActive(true)} showForgotPassword={true} />
      </div>

      {/* Signup Form */}
      <div className="form-container sign-up-container">
        <Signup setIsActive={() => setIsRightPanelActive(false)} />
      </div>

      {/* Overlay Panel */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1 className="overlay-title">Welcome Back!</h1>
            <p style={{ color: 'white' }}>Ready for your next adventure? Sign in now.</p>
            <button className="ghost-login" onClick={() => {
              setIsRightPanelActive(false);
              navigate('/login');
            }}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1 className="overlay-title">Hello, Friend!</h1>
            <p style={{ color: 'white' }}>Your journey begins here. Register now!</p>
            <button className="ghost-login" onClick={() => {
              setIsRightPanelActive(true);
              navigate('/signup');
            }}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;