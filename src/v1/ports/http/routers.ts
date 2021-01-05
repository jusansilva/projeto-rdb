import { Express } from "express";
import { v1 } from "./routers/index";
import * as express from "express";
import * as  bodyParser from 'body-parser';
import { Healht } from "./routers/health-routes";
import { Front } from "./routers/front-routes";


export class AppRouters {
  static async load(app: Express): Promise<void> {
    // app.use(express.static("public"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(Front);
    app.use(v1);
    app.use(Healht);
  }
}

export { v1 };
