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
exports.UserRepository = void 0;
const model_1 = require("./model/");
class UserRepository {
    logar(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const find = yield model_1.UserModel.findOne({ email: email, password: password });
                return find;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
    updateToken(token, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield model_1.UserModel.update({ email: email }, { token: token });
                return updated;
            }
            catch (error) {
            }
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user-repository.js.map