"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Front = void 0;
const express_1 = require("express");
const express = require("express");
const controllers_1 = require("../controllers");
const typedi_1 = require("typedi");
const Front = express_1.Router();
exports.Front = Front;
Front.use(express.static("public"));
Front.use(sendViewMiddleware);
const controller = typedi_1.default.get(controllers_1.UserControlles);
Front.route("/").get((req, res) => {
    res.redirect("/login");
});
Front.route("/docs").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.query.t;
    if (auth) {
        const verify = yield controller.auth(auth);
        if (verify.auth) {
            return res.sendView('doc.html');
        }
        else {
            return res.sendView('login.html');
        }
    }
    res.set('x-access-token', auth);
    return res.redirect('/login?status=false');
}));
Front.route('/login').get((req, res) => {
    res.sendView('login.html');
});
function sendViewMiddleware(req, res, next) {
    res.sendView = function (view) {
        return res.sendFile("/" + view, { root: "public" });
    };
    next();
}
//# sourceMappingURL=front-routes.js.map