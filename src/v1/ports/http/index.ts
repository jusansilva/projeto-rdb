import * as mongoose from "mongoose";
import { Logger } from "fleury-digital-commons";
import { DataBaseEnv } from "../../adapters/suport-danone/envs";
import { Server } from "../../config/server";

const startServer = async () => {
  Logger.info("Initializing Application Server");
  await Server.init();
};

const connectDataBse = async () => {
  try {
    Logger.info("Connecting to Database!");
    await mongoose.connect(DataBaseEnv.URI, {
      dbName: DataBaseEnv.DATABASE,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoCreate: true,
    });
    Logger.info("Database Connected!");
  } catch (error) {
    Logger.error(error);
    return error;
  }
};

const startApplication = async () => {
  await connectDataBse();
  await startServer();
};

startApplication();
