import pino from "pino";

const demologger = pino({
    level: "debug"
})

demologger.info("Server Started");

demologger.debug({
    port: 3000,
    env: "development"
})

demologger.warn({
    userId: "user_id",
    message: "Invalid credentials"
}, "Login failed");

demologger.error({
    errorCode: "DATABASE_ERROR",
}, "Database unavailable");


//Child Logger

import { randomUUID } from "node:crypto";


function handleRequest() {
  const requestId = randomUUID();

  const requestLogger = logger.child({
    requestId,
  });

  requestLogger.info("Request received\n");

  requestLogger.info({
    userId: "user_123",
  }, "Fetching user\n");

  requestLogger.info("Request completed\n");
}

handleRequest();
handleRequest();


// Example implementation 

export const logger = pino({
  level: "info",

  timestamp: pino.stdTimeFunctions.isoTime,

  redact: {
    paths: [
      "password",
      "token",
      "accessToken",
      "refreshToken",
      "authorization",
      "headers.authorization",
      "headers.cookie",
      "user.password",
      "user.token",
    ],
    censor: "[REDACTED]",
  },
});

interface RequestData {
  name: string;
  shouldFail: boolean;
  password: string;
  token: string;
}

async function simulateRequest(data: RequestData): Promise<void> {
  const requestId = randomUUID();
  const startTime = performance.now();

  try {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

    if (data.shouldFail) {
      throw new Error("Simulated request failure");
    }

    const durationMs = performance.now() - startTime;

    logger.info(
      {
        requestId,
        name: data.name,
        durationMs: Number(durationMs.toFixed(2)),
        password: data.password,
        token: data.token,
        status: "success",
      },
      "Request completed successfully",
    );
  } catch (error) {
    const durationMs = performance.now() - startTime;

    logger.warn({
      requestId,
      requestName: data.name,
      durationMs: Number(durationMs.toFixed(2)),
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }, "Request failed");
  }
}


const requests: RequestData[] = [
  {
    name: "Get Users",
    shouldFail: false,
    password: "secret123",
    token: "token-abc",
  },
  {
    name: "Create User",
    shouldFail: true,
    password: "admin123",
    token: "token-xyz",
  },
  {
    name: "Update Profile",
    shouldFail: false,
    password: "password123",
    token: "token-def",
  },
];


await Promise.all(requests.map(simulateRequest));