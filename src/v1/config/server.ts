import * as express from "express";
import { AppEnvs } from "../adapters/suport-danone/envs";
import { AppRouters } from "../ports/http/routers";
const app = express();

export class Server {
  static async init(): Promise<void> {
    AppMiddlewares.loadMiddlewares(app);
    await AppRouters.load(app);
    app.listen(AppEnvs.server.port, AppEnvs.server.host, () =>
      Logger.info(
        `server started on ${AppEnvs.server.host}:${AppEnvs.server.port} Environment: ${AppEnvs.environment} 🚀`
      )
    );
  }
}
