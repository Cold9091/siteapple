import express, { type Request, Response, NextFunction } from "express";
import { registerServerlessRoutes } from "./routes-serverless";

let app: any = null;

async function getApp() {
  if (!app) {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Setup routes for serverless
    await registerServerlessRoutes(app);

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
  }
  return app;
}

export default async function handler(req: Request, res: Response) {
  const expressApp = await getApp();
  return expressApp(req, res);
}