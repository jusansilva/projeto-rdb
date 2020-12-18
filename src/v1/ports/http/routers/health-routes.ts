import { Router, Request, Response } from "express";
import * as mongoose from "mongoose";
import { Server } from "../../../config/server";
import { DataBaseEnv } from "../../../adapters/envs";

const Healht = Router();
Healht.route("/v1/health/ready").get((req: Request, res: Response) => {
  res.send("OK").status(200);
});

Healht.route("/v1/health/services").get(async (req: Request, res: Response) => {
  try {
    await Server.init();
    console.log("Connecting to Database!");
    await mongoose.connect(DataBaseEnv.URI, {
      dbName: DataBaseEnv.DATABASE,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected!");
    res.send("OK").status(200);
  } catch (error) {
    console.log("error connecting database", error);
    res.send(error).status(500);
  }
});



export { Healht };
