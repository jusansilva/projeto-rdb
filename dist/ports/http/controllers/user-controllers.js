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
exports.UserControlles = void 0;
const delegate_1 = require("../../../business/delegate");
class UserControlles {
    constructor() {
        this.delegate = new delegate_1.UserBusinessDelegate();
    }
    create(dto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const create = yield this.delegate.create(dto);
                res.json(create);
                return create;
            }
            catch (error) {
            }
        });
    }
    logar(body, res, authorization) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logado = yield this.delegate.logar(body, authorization);
                res.set({ Authorization: logado.token,
                    teste: "to aqui" });
                res.redirect(`/docs?t=${logado.token}`);
                return logado;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    auth(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authVerify = yield this.delegate.auth(auth);
                return authVerify;
            }
            catch (error) {
            }
        });
    }
}
exports.UserControlles = UserControlles;
//# sourceMappingURL=user-controllers.js.map