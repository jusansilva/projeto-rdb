"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const express_1 = require("express");
const typedi_1 = require("typedi");
const controllers_1 = require("../controllers");
const User = express_1.Router();
exports.User = User;
const controller = typedi_1.Container.get(controllers_1.UserControlles);
User.route("/v1/user").post((req, res) => {
    return controller.create(req.body, res);
});
User.route('/v1/logar').post((req, res) => {
    var _a;
    const authorization = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.toString();
    return controller.logar(req.body, res, authorization);
});
//# sourceMappingURL=user-routes.js.map