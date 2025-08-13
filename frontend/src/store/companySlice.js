// src/store/companySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 📌 Fetch company profile
export const fetchCompanyProfile = createAsyncThunk(
  "company/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/company/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Create or update company profile
export const saveCompanyProfile = createAsyncThunk(
  "company/saveProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/company/profile", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Upload logo
export const uploadLogo = createAsyncThunk(
  "company/uploadLogo",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("logo", file);

      const res = await axios.post("/api/company/upload-logo", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Upload banner
export const uploadBanner = createAsyncThunk(
  "company/uploadBanner",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("banner", file);

      const res = await axios.post("/api/company/upload-banner", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save profile
      .addCase(saveCompanyProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Upload logo
      .addCase(uploadLogo.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.logo_url = action.payload.logo_url;
        }
      })
      // Upload banner
      .addCase(uploadBanner.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.banner_url = action.payload.banner_url;
        }
      });
  },
});

export default companySlice.reducer;
