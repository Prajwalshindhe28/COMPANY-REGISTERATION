// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./companySlice"; // ✅ default import from companySlice.js

export const store = configureStore({
  reducer: {
    company: companyReducer, // ✅ Add company slice reducer
  },
});
