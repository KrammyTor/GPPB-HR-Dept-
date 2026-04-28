const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Build UI",
    status: "open"
  }
];

// GET all jobs
app.get("/jobs", (req, res) => {
  res.json(jobs);
});

// ADD job
app.post("/jobs", (req, res) => {
  const newJob = {
    id: Date.now(),
    ...req.body
  };
  jobs.push(newJob);
  res.json(newJob);
});

// UPDATE job
app.put("/jobs/:id", (req, res) => {
  const id = parseInt(req.params.id);

  jobs = jobs.map(job =>
    job.id === id ? { ...job, ...req.body } : job
  );

  res.json({ message: "Updated" });
});

// DELETE job
app.delete("/jobs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  jobs = jobs.filter(job => job.id !== id);

  res.json({ message: "Deleted" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});