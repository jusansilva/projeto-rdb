import { Express } from "express";
import { v1 } from "./routers/index";
import { log } from "fleury-digital-commons";
import * as fs from "fs";
import { parse, fromRefract } from "snowboard-parser";
import { default as mocker } from "snowboard-mock-router";
import * as express from "express";
import { AppEnvs } from "../../adapters/suport-danone/envs/app-env";

export class AppRouters {
  @log
  static async load(app: Express): Promise<void> {
    app.use(express.static("docs"));

    if (AppEnvs.server.useMocks) {
      const file = fs.readFileSync("./api.apib").toString();
      const elements = await parse(file);
      const items = fromRefract(elements);
      const router = await mocker([items]);
      v1.use(router);
      app.use(v1);
    } else {
      app.use(v1);
    }
  }
}

export { v1 };
