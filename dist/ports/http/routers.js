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
exports.v1 = exports.AppRouters = void 0;
const index_1 = require("./routers/index");
Object.defineProperty(exports, "v1", { enumerable: true, get: function () { return index_1.v1; } });
const express = require("express");
class AppRouters {
    static load(app) {
        return __awaiter(this, void 0, void 0, function* () {
            app.use(express.static("docs"));
            app.use(index_1.v1);
        });
    }
}
exports.AppRouters = AppRouters;
//# sourceMappingURL=routers.js.map