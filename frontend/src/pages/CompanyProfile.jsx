import React, { useEffect, useState } from "react";
import { getCompanyProfile, saveCompanyProfile, uploadLogo, uploadBanner } from "../api/companyApi";
import { toast } from "react-toastify";

export default function CompanyProfile() {
  const [profile, setProfile] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const data = await getCompanyProfile(token);
        setProfile(data);
      } catch (error) {
        toast.error("Failed to fetch profile");
      }
    })();
  }, []);

  return (
    <div>
      <h1>Company Profile</h1>
      <p>Name: {profile.name}</p>
    </div>
  );
}
