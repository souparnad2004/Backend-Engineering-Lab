import { app } from "./app.js";

const PORT = Number(process.env.PORT ?? 3000);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on port ${PORT}`);
});

function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down...`);

  server.close((error) => {
    if (error) {
      console.error("Shutdown failed:", error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));