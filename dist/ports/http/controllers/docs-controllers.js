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
exports.DocsControlles = void 0;
const delegate_1 = require("../../../business/delegate");
class DocsControlles {
    constructor() {
        this.delegate = new delegate_1.DocsBusinessDelegate();
    }
    importData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.delegate.import(req);
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    getRelatioship(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { date, carro } = req;
                const find = yield this.delegate.find(date, carro);
                res.json(find);
                return find;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    saveRelatioship(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const { date, carro } = req;
                // const save = await this.delegate.saveRelatioship(date, carro);
                // res.json(save);
                return "m construção";
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
}
exports.DocsControlles = DocsControlles;
//# sourceMappingURL=docs-controllers.js.map