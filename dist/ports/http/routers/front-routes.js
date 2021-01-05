"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Front = void 0;
const express_1 = require("express");
const express = require("express");
const multer = require("multer");
const controllers_1 = require("../controllers");
const typedi_1 = require("typedi");
const upload = multer({ dest: 'uploads/' });
const Front = express_1.Router();
exports.Front = Front;
Front.use(express.static("public"));
const controller = typedi_1.default.get(controllers_1.UserControlles);
Front.route("/").get((req, res) => {
    res.send("To aqui");
});
Front.route('/login').get((req, res) => {
    res.sendFile("/login.html");
});
Front.route('/logar').post((req, res) => {
    return controller.logar(req.body, res);
});
//# sourceMappingURL=front-routes.js.map