

import axios from "axios";

const API_URL = "https://end-user.onrender.com/api";


export const login = async (phone) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, { phone });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to send OTP");
  }
};

export const verifyOTP = async (phone, email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/user/verify-otp`, { phone, email, otp });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to verify OTP");
  }
};

export const registerUser = async (name, email, phone) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, { name, email, phone });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to register");
  }
};


export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/user/logout`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to logout");
  }
};