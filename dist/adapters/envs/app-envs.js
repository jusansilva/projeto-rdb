"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEnvs = void 0;
const AppEnvs = {
    port: Number(process.env.PORT) || 8080,
    host: process.env.HOST || "localhost"
};
exports.AppEnvs = AppEnvs;
//# sourceMappingURL=app-envs.js.map