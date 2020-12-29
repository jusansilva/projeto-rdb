import { Express } from "express";
import { v1 } from "./routers/index";
import * as express from "express";
import * as  bodyParser from 'body-parser';
import { Healht } from "./routers/health-routes"


export class AppRouters {
  static async load(app: Express): Promise<void> {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(express.static("docs"));
    app.use(express.static("public"));
    app.use(v1);
    app.use(Healht);
  }
}

export { v1 };
