"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1 = void 0;
const express_1 = require("express");
const import_docs_routes_1 = require("./import-docs-routes");
const user_routes_1 = require("./user-routes");
const v1 = express_1.Router();
exports.v1 = v1;
v1.use(import_docs_routes_1.ImportDocs);
v1.use(user_routes_1.User);
//# sourceMappingURL=index.js.map