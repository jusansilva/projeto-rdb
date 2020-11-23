import * as mongoose from "mongoose";
import { DataBaseEnv } from "../../adapters/envs";
import { Server } from "../../config/server";

const startServer = async () => {
  console.log("Initializing Application Server");
  await Server.init();
};

const connectDataBse = async () => {
  try {
    console.log("Connecting to Database!");
    await mongoose.connect(DataBaseEnv.URI, {
      dbName: DataBaseEnv.DATABASE,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoCreate: true,
    });
    console.log("Database Connected!");
  } catch (error) {
    console.error(error);
    return error;
  }
};

const startApplication = async () => {
  await connectDataBse();
  await startServer();
};

startApplication();
