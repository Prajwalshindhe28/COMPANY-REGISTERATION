import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// ✅ Register User
export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

// ✅ Login User
export const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  return res.data;
};
