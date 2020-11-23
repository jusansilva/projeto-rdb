"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1 = void 0;
const express_1 = require("express");
const health_routes_1 = require("./health-routes");
const v1 = express_1.Router();
exports.v1 = v1;
v1.use(health_routes_1.Healht);
//# sourceMappingURL=index.js.map