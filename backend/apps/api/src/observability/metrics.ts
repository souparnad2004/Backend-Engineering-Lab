import {
  Registry,
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
} from "prom-client";

import type { Request, Response, NextFunction } from "express";

export const register = new Registry();

collectDefaultMetrics({
  register,
  prefix: "nodejs_",
});

// Total HTTP requests
const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [register],
});

// http request duration
const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Active HTTP requests
const httpRequestsInFlight = new Gauge({
  name: "http_requests_in_flight",
  help: "Number of HTTP requests currently being processed",
  registers: [register],
});

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.path === "/metrics") {
    return next();
  }

  const endTimer = httpRequestDuration.startTimer();

  httpRequestsInFlight.inc();

  let completed = false;

  function finishRequest() {
    if (completed) return;

    completed = true;
    httpRequestsInFlight.dec();

    const route = req.route?.path
      ? `${req.baseUrl}${String(req.route.path)}`
      : "unmatched";

    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);

    endTimer(labels);
  }

  res.once("finish", finishRequest);
  res.once("close", finishRequest);

  next();
}
