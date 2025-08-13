import React, { useEffect, useState } from "react";
import { getJobs } from "../api/jobsApi";
import { Link } from "react-router-dom";

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getJobs();
      if (res.success) setJobs(res.data);
    })();
  }, []);

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <Link to={`/jobs/${job.id}`}>{job.title}</Link> - {job.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
