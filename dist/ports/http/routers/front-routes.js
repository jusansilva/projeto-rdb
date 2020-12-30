"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Front = void 0;
const express_1 = require("express");
const Front = express_1.Router();
exports.Front = Front;
Front.route("/").get((req, res) => {
    res.send("OK").status(200);
});
Front.route('/login').get((req, res) => {
    res.send("/login.html");
});
//# sourceMappingURL=front-routes.js.map