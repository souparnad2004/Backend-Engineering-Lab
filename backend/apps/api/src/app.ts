import express from "express";
import os from "node:os";

import {
  metricsMiddleware,
  register,
} from "./observability/metrics.js";

export const app = express();

app.use(express.json());

// Metrics middleware
app.use(metricsMiddleware);

app.get("/", (_req, res) => {
  res.json({
    message: "Production Backend API",
    instance: os.hostname(),
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    instance: os.hostname(),
  });
});

app.get("/ready", (_req, res) => {
  res.json({
    status: "ready",
    instance: os.hostname(),
  });
});

// Simulate slow requests
app.get("/slow", async (_req, res) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 500),
  );

  res.json({
    message: "Slow request completed",
  });
});

// Simulate application errors
app.get("/error", (_req, res) => {
  res.status(500).json({
    error: "Simulated server error",
  });
});

// Prometheus metrics endpoint
app.get("/metrics", async (_req, res) => {
  res.setHeader(
    "Content-Type",
    register.contentType,
  );

  res.send(await register.metrics());
});