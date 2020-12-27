"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportDocs = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const typedi_1 = require("typedi");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
const ImportDocs = express_1.Router();
exports.ImportDocs = ImportDocs;
const controller = typedi_1.default.get(controllers_1.DocsControlles);
ImportDocs.route("/v1/import", upload.single("import")).post((req, res, next) => {
    Promise.resolve().then(function () {
        return controller.importData(req.body, res);
    }).catch(next);
});
ImportDocs.route("/v1/relacao").get((req, res, next) => {
    Promise.resolve().then(function () {
        return controller.getRelatioship(req.params, res);
    });
});
ImportDocs.route("/v1/relacao/cron").get((req, res, next) => {
    Promise.resolve().then(function () {
        return controller.saveRelatioship(req.params, res);
    });
});
//# sourceMappingURL=import-docs-routes.js.map