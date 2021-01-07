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
exports.DocsBusinessDelegate = void 0;
const typedi_1 = require("typedi");
const factory_1 = require("../../config/factory");
const factory_2 = require("../factory");
class DocsBusinessDelegate {
    constructor() {
        this.factory = new factory_2.DocsFactory();
        // async saveRelatioship(date?: string, carro?: string):Promise<string>{
        //   return this.factory.build().saveRelatioship(date, carro);
        // }
    }
    import(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.factory.build().import(dto);
        });
    }
    find(date, carro) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.factory.build().find(date, carro);
        });
    }
}
__decorate([
    typedi_1.Inject(factory_1.FactoryName.BusinessDoc),
    __metadata("design:type", Object)
], DocsBusinessDelegate.prototype, "factory", void 0);
exports.DocsBusinessDelegate = DocsBusinessDelegate;
//# sourceMappingURL=docs-business-delegate.js.map