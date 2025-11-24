import React, { useState, useEffect } from 'react';
import { FaCcVisa, FaCcMastercard, FaSpinner } from 'react-icons/fa';
import './CreditCardInput.css';

const CreditCardInput = ({ onPaymentComplete }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardType, setCardType] = useState(null);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const detectCardType = (number) => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);

    if (firstDigit === '4') {
      return 'visa';
    } else if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) {
      return 'mastercard';
    }
    return null;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardType(detectCardType(formatted.replace(/\s/g, '')));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  };

  return (
    <div className="credit-card-container">
      <form onSubmit={handleSubmit} className="credit-card-form">
        <div className="card-input-wrapper">
          <div className="card-number-input">
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className="card-input"
            />
            <div className="card-type-icon">
              {cardType === 'visa' && <FaCcVisa className="card-icon visa" />}
              {cardType === 'mastercard' && <FaCcMastercard className="card-icon mastercard" />}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="process-payment-btn"
          disabled={isProcessing || cardNumber.length < 19}
        >
          {isProcessing ? (
            <span className="processing-text">
              <FaSpinner className="spinner" />
              Processing Payment...
            </span>
          ) : (
            'Pay Now'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreditCardInput; 