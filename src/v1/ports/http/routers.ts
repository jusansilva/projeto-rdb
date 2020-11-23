import { Express } from "express";
import { v1 } from "./routers/index";
import * as express from "express";

export class AppRouters {
  static async load(app: Express): Promise<void> {
    app.use(express.static("docs"));
    app.use(v1);
  }
}

export { v1 };
