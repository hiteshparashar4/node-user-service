import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import errorHandler from "@/middleware/errorHandler";
import { initContainer } from "@/containers/initContainer";

const healthStatus = async (app: Express, res: Response): Promise<Response> => {
  if (!app.locals.dbReady) {
    return res
      .status(503)
      .json({ status: "not_ready", detail: "database not connected" });
  }
  try {
    const sequelize = app.locals.container.resolve("sequelize") as any;
    await sequelize.query("SELECT 1");
    return res.json({ status: "App up and DB ready" });
  } catch (err: any) {
    return res
      .status(503)
      .json({ status: "App up and DB not ready", detail: err.message });
  }
};

const createApp = async () => {
  const app: Express = express();
  app.use(morgan(process.env.MORGAN_FORMAT || "dev"));
  app.use(express.json());

  app.locals.dbReady = false;
  app.locals.container = null;

  initContainer(app);

  app.get("/", (_req: Request, res: Response) =>
    res.send("App is up. Check DB status with /health")
  );
  app.get("/health", async (_req: Request, res: Response) =>
    healthStatus(app, res)
  );

  app.use(errorHandler);
  return app;
};

export default createApp;
