import express from "express";
import os from "os";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello from k6 experiment",
    instance: os.hostname(),
  });
});

app.get("/fast", (req, res) => {
  res.json({
    message: "Fast response",
    timestamp: Date.now(),
    instance: os.hostname(),
  });
});

app.get("/slow", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  res.json({
    message: "Slow response",
    instance: os.hostname(),
  });
});

app.get("/cpu", (req, res) => {
  const start = performance.now();

  while (performance.now() - start < 50) {
    // Simulate CPU-intensive work
  }

  res.json({
    message: "CPU-intensive request completed",
    instance: os.hostname(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://localhost:${PORT}`);
});