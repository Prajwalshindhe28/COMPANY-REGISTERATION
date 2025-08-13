import React from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../api/authApi"; // ✅ correct import
import { toast } from "react-toastify";

export default function Register() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success("Registered successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      <input {...register("password")} type="password" placeholder="Password" />
      <input {...register("full_name")} placeholder="Full Name" />
      <button type="submit">Register</button>
    </form>
  );
}
