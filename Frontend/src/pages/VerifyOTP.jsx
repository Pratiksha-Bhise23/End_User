
//...........................................................................................

import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP } from '../api/auth';
import { Plane } from 'lucide-react';
import { useAuth } from '../Auth/AuthContext';

const VerifyOTP = ({ onClose }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { loginUser } = useAuth();

  const { phone, email } = location.state || {};

  if (!phone && !email) {
    navigate('/login');
    return null;
  }

  const handleOtpChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      alert('Please enter a 6-digit OTP.');
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOTP(phone, email, otpValue);
      if (response.status === 'verified' && response.session_id) {
        loginUser(response.session_id);
        setSuccess('OTP verified successfully! Mobile number has been stored.');
        setTimeout(() => {
          navigate('/');
          if (onClose) onClose();
        }, 2000);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-none bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-center mb-6">
          <Plane className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Verify OTP
        </h2>
        <p className="text-gray-600 mb-4 text-center">
          An OTP has been sent to {phone || email}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-center" htmlFor="otp">
              Enter OTP
            </label>
            <div className="flex justify-center space-x-2 sm:space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-medium rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition duration-300"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;