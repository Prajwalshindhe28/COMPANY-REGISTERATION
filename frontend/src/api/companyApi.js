import axios from "axios";

const API_URL = "http://localhost:5000/api/company";

// ✅ Create or update company profile
export const saveCompanyProfile = async (data, token) => {
  const res = await axios.post(`${API_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Get company profile
export const getCompanyProfile = async (token) => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Upload company logo
export const uploadLogo = async (file, token) => {
  const formData = new FormData();
  formData.append("logo", file);

  const res = await axios.post(`${API_URL}/upload-logo`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ✅ Upload company banner
export const uploadBanner = async (file, token) => {
  const formData = new FormData();
  formData.append("banner", file);

  const res = await axios.post(`${API_URL}/upload-banner`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
