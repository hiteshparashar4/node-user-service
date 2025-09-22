import "source-map-support/register";
import { Express } from "express";
import dotenv from "dotenv";
import { Server } from "http";
import createApp from "@/createApp";
import { Sequelize } from "sequelize";
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const initServer = async () => {
  const app: Express = await createApp();
  const server: Server = app.listen(PORT, () =>
    console.log(`Server listening on ${PORT}`)
  );

  const shutdown = async () => {
    server.close(async () => {
      try {
        const container = (app).locals.container;
        if (container) {
          const sequelize: Sequelize = container.resolve("sequelize");
          if (sequelize) {
            await sequelize.close();
            console.log("Sequelize connection closed");
          }
        }
      } catch (err) {
        console.error("Error during shutdown", err);
      } finally {
        process.exit(0);
      }
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};
initServer();
