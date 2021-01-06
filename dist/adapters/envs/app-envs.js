"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEnvs = void 0;
const AppEnvs = {
    port: Number(process.env.PORTA) || 3000,
    host: process.env.HOST || "0.0.0.0",
    algorithm: process.env.ALGORITH || 'aes-256-ctr',
    password: process.env.PASSWORD || 'd6F3Efeq',
    IV_LENGTH: Number(process.env.IV_LENGTH) || 16,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "rdb2020",
};
exports.AppEnvs = AppEnvs;
//# sourceMappingURL=app-envs.js.map