import express from "express";
import { serveStatic } from "./static.js";
import { createServer } from "http";
const app = express();
const httpServer = createServer(app);
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: false }));
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
const shouldLogApiRequests = process.env.SHOW_API_LOGS === "true";

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (shouldLogApiRequests && path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });
  next();
});
async function createApp({ isProduction = process.env.NODE_ENV === "production", includeStatic = isProduction } = {}) {
  if (process.env.DATABASE_URL) {
    const { registerRoutes } = await import("./routes.js");
    await registerRoutes(httpServer, app);
  } else {
    const { registerDemoRoutes } = await import("./demoRoutes.js");
    registerDemoRoutes(app);
  }
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (includeStatic) {
    serveStatic(app);
  } else if (!isProduction) {
    const { setupVite } = await import("./vite.js");
    await setupVite(httpServer, app);
  }
  return app;
}

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  await createApp({ isProduction });
  const port = parseInt(process.env.PORT || "5000", 10);
  let activePort = null;
  const listen = (listenPort) => {
    httpServer.once("error", (error) => {
      if (error.code === "EADDRINUSE" && !isProduction) {
        log(`port ${listenPort} is busy; trying port ${listenPort + 1}`);
        listen(listenPort + 1);
        return;
      }
      throw error;
    });
    httpServer.listen(
      {
        port: listenPort,
        host: "0.0.0.0"
      },
      () => {
        if (activePort === null) {
          activePort = listenPort;
          log(`serving on http://localhost:${listenPort}`);
        }
      }
    );
  };
  listen(port);
}

export {
  createApp,
  log,
  startServer
};
