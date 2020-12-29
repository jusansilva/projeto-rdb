"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEnvs = void 0;
const AppEnvs = {
    port: Number(process.env.PORTA) || 3000,
    host: process.env.HOST || "0.0.0.0"
};
exports.AppEnvs = AppEnvs;
//# sourceMappingURL=app-envs.js.map