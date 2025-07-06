
//...........................................................
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { Plane } from 'lucide-react';

const Login = ({ onClose, onRegister, onVerifyOtp }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const response = await login(phone);
      console.log('Login API response:', response);
      if (response.status === 'otp_sent') {
        console.log('Navigating to verify-otp with phone:', phone);
        if (onVerifyOtp) {
          onVerifyOtp(phone);
        } else {
          navigate('/verify-otp', { state: { phone } });
        }
      } else if (response.status === 'register') {
        console.log('Navigating to register with phone:', phone);
        if (onRegister) {
          onRegister(phone);
        } else {
          navigate('/register', { state: { phone } });
        }
      } else {
        console.log('Unexpected API response:', response);
        setError('Invalid response from server');
      }
      if (onClose) onClose();
    } catch (err) {
      console.log('Login error:', err);
      setError(err.message || 'Failed to send OTP');
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
          MultiflyTravel Login
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="phone">
            Mobile Number
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="button"
          onClick={handleSubmit}
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
              Sending OTP...
            </>
          ) : (
            'Send OTP'
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;