"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsFactory = void 0;
const typedi_1 = require("typedi");
const factory_1 = require("../../config/factory");
const logic_1 = require("../../business/logic");
const repositories_1 = require("../repositories");
const delegate_1 = require("../../../business/delegate");
let DocsFactory = class DocsFactory {
    build() {
        return new logic_1.DocsBusiness(typedi_1.default.get(repositories_1.DocsRepository), new delegate_1.DocsBusinessDelegate());
    }
};
DocsFactory = __decorate([
    typedi_1.Service(factory_1.FactoryName.BusinessSuportDanone)
], DocsFactory);
exports.DocsFactory = DocsFactory;
//# sourceMappingURL=docs-factory.js.map