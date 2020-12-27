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
exports.Healht = void 0;
const express_1 = require("express");
const mongoose = require("mongoose");
const server_1 = require("../../../config/server");
const envs_1 = require("../../../adapters/envs");
const Healht = express_1.Router();
exports.Healht = Healht;
Healht.route("/v1/health/ready").get((req, res) => {
    res.send("OK").status(200);
});
Healht.route("/v1/health/services").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server_1.Server.init();
        console.log("Connecting to Database!");
        yield mongoose.connect(envs_1.DataBaseEnv.URI, {
            dbName: envs_1.DataBaseEnv.DATABASE,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database Connected!");
        res.send("OK").status(200);
    }
    catch (error) {
        console.log("error connecting database", error);
        res.send(error).status(500);
    }
}));
//# sourceMappingURL=health-routes.js.map