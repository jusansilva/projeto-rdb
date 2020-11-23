import * as express from "express";
import { AppEnvs } from "../adapters/envs";
import { AppRouters } from "../ports/http/routers";
const app = express();

export class Server {
  static async init(): Promise<void> {
    await AppRouters.load(app);
    app.listen(AppEnvs.port, AppEnvs.host, () =>
      console.log(
        `server started on ${AppEnvs.host}:${AppEnvs.port} 🚀`
      )
    );
  }
}
