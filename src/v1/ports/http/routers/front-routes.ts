import { Router, Request, Response } from "express";
import { Server } from "../../../config/server";
import { DataBaseEnv } from "../../../adapters/envs";

const Front = Router();
Front.route("/").get((req: Request, res: Response) => {
  res.send("OK").status(200);
});

Front.route('/login').get((req: Request, res: Response) => {
    res.send("public/login.html");
})


export { Front };
