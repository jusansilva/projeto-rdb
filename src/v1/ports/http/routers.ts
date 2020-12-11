import { Express } from "express";
import { v1 } from "./routers/index";
import * as express from "express";
import * as  bodyParser from 'body-parser';


export class AppRouters {
  static async load(app: Express): Promise<void> {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(express.static("docs"));
    app.use(v1);
  }
}

export { v1 };
