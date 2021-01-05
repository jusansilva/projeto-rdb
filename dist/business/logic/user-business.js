"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.UserBusiness = void 0;
const typedi_1 = require("typedi");
const repositories_1 = require("../../adapters/repositories");
const jsonwebtoken_1 = require("jsonwebtoken");
let UserBusiness = class UserBusiness {
    constructor(container) {
        this.repository = container.get(repositories_1.UserRepository);
    }
    logar(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const find = yield this.repository.logar(dto.email, dto.password);
                if (!find)
                    return { auth: false, message: 'User or passwor not found' };
                if (find.token) {
                    const jwtVerify = jsonwebtoken_1.default.verify(find.token, process.env.SECRET, function (err, decoded) {
                        if (err) {
                            const token = jsonwebtoken_1.default.sign(find.email, process.env.SECRET, {
                                expiresIn: 3600 // expires in 10min
                            });
                            this.repository.updateToken(token, dto.email);
                        }
                        return { auth: true, token: decoded.token };
                    });
                    return jwtVerify;
                }
                else {
                    const token = jsonwebtoken_1.default.sign(find.email, process.env.SECRET, {
                        expiresIn: 3600 // expires in 10min
                    });
                    yield this.repository.updateToken(token, dto.email);
                    return { auth: true, token: token };
                }
            }
            catch (error) {
                console.log(error);
                return error;
            }
        });
    }
};
UserBusiness = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [typedi_1.ContainerInstance])
], UserBusiness);
exports.UserBusiness = UserBusiness;
//# sourceMappingURL=user-business.js.map