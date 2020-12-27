"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1 = void 0;
const express_1 = require("express");
const health_routes_1 = require("./health-routes");
const import_docs_routes_1 = require("./import-docs-routes");
const views_routes_1 = require("./views-routes");
const v1 = express_1.Router();
exports.v1 = v1;
v1.use(import_docs_routes_1.ImportDocs);
v1.use(health_routes_1.Healht);
v1.use(views_routes_1.ViewsRouter);
//# sourceMappingURL=index.js.map