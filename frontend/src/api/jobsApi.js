import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

// ✅ Get all jobs
export const getJobs = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// ✅ Get single job by ID
export const getJobById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// ✅ Create a new job (protected)
export const createJob = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Apply to a job (protected)
export const applyToJob = async (jobId, formData, token) => {
  const res = await axios.post(`http://localhost:5000/api/applications/${jobId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
