"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = void 0;
const typedi_1 = require("typedi");
const factory_1 = require("../../config/factory");
const logic_1 = require("../logic");
let UserFactory = class UserFactory {
    build() {
        return typedi_1.default.get(logic_1.UserBusiness);
    }
};
UserFactory = __decorate([
    typedi_1.Service(factory_1.FactoryName.BusinessUser)
], UserFactory);
exports.UserFactory = UserFactory;
//# sourceMappingURL=user-factory.js.map