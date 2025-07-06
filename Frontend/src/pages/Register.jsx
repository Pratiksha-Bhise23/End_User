
//...............................................................................................................
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { Plane } from "lucide-react";

const Register = ({ onClose, onVerifyOtp }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone;

  if (!phone) {
    console.log("Phone number not provided, redirecting to login");
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await registerUser(name, email, phone);
      console.log("Register API response:", response);
      if (response.status === "otp_sent") {
        if (onVerifyOtp) {
          onVerifyOtp(phone, response.email);
        } else {
          navigate("/verify-otp", { state: { email: response.email, phone } });
        }
      }
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <Plane className="w-12 h-12 text-blue-500" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Register with MultiflyTravel
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Mobile Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              disabled
              className="w-full p-3 rounded-lg bg-gray-200 text-gray-600"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Close Button for Modal */}
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

export default Register;