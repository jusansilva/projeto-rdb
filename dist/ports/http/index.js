"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../config/server");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Initializing Application Server");
    yield server_1.Server.init();
});
const connectDataBse = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Connecting to Database!");
        // await mongoose.connect(DataBaseEnv.URI, {
        //   dbName: DataBaseEnv.DATABASE,
        //   useCreateIndex: true,
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true,
        //   autoCreate: true,
        // });
        console.log("Database Connected!");
    }
    catch (error) {
        console.error(error);
        return error;
    }
});
const startApplication = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDataBse();
    yield startServer();
});
startApplication();
//# sourceMappingURL=index.js.map