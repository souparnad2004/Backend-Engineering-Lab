import express from "express";
import os from "node:os";

export const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Production Backend API",
    instance: os.hostname(),
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    instance: os.hostname(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/ready", (_req, res) => {
  res.status(200).json({
    status: "ready",
    instance: os.hostname(),
  });
});