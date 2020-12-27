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
exports.ViewsRouter = void 0;
const express_1 = require("express");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
const ViewsRouter = express_1.Router();
exports.ViewsRouter = ViewsRouter;
ViewsRouter.route("/").get((req, res, next) => {
    return res.send("to aqui");
});
ViewsRouter.route("/login").get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield res.sendFile("/Users/jusanmagno/projetos/Projeto RDB/src/views/login.html");
}));
ViewsRouter.route("/doc", upload.single("import")).get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
}));
//# sourceMappingURL=views-routes.js.map