import React from "react";
import { useForm } from "react-hook-form";
import { login } from "../api/authApi"; // ✅ correct import
import { toast } from "react-toastify";

export default function Login() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await login(data); // call backend
      toast.success("Login successful");
      localStorage.setItem("token", res.token);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      <input {...register("password")} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
