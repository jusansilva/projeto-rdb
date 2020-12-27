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
exports.Server = void 0;
const express = require("express");
const envs_1 = require("../adapters/envs");
const routers_1 = require("../ports/http/routers");
const app = express();
class Server {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield routers_1.AppRouters.load(app);
            app.listen(envs_1.AppEnvs.port, envs_1.AppEnvs.host, () => console.log(`server started on ${envs_1.AppEnvs.host}:${envs_1.AppEnvs.port} 🚀`));
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map