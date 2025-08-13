import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/createJob";
import JobList from "./pages/Joblist";
import JobDetails from "./pages/JobDetails";
import Settings from "./pages/Settings";
import CompanyProfile from "./pages/CompanyProfile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
