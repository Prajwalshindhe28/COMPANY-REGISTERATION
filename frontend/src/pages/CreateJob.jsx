import React from "react";
import { useForm } from "react-hook-form";
import { createJob } from "../api/jobsApi";
import { toast } from "react-toastify";

export default function CreateJob() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await createJob(data);
      if (res.success) {
        toast.success("Job posted successfully!");
        reset();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error posting job");
    }
  };

  return (
    <div>
      <h2>Create Job</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("title")} placeholder="Job Title" required />
        <textarea {...register("description")} placeholder="Job Description" required />
        <input {...register("location")} placeholder="Location" required />
        <input {...register("salary_range")} placeholder="Salary Range" />
        <select {...register("job_type")}>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="internship">Internship</option>
        </select>
        <input {...register("experience_level")} placeholder="Experience Level" />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}
