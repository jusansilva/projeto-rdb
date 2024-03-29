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
exports.GpsImportRepository = void 0;
const model_1 = require("./model");
class GpsImportRepository {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bilhetagem = model_1.GpsImportModel.create(dto);
                return bilhetagem;
            }
            catch (error) {
                throw error;
            }
        });
    }
    find(data, carro, skip = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data !== undefined && carro !== undefined) {
                    return yield model_1.GpsImportModel.find({ "data": data, "carro": carro }).skip(skip);
                }
                if (data !== undefined && carro === undefined) {
                    return yield model_1.GpsImportModel.find({ "data": data });
                }
                if (carro !== undefined && data === undefined) {
                    return yield model_1.GpsImportModel.find({ "carro": carro }).skip(skip);
                }
                return yield model_1.GpsImportModel.find().skip(skip);
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.GpsImportRepository = GpsImportRepository;
//# sourceMappingURL=gps-import-repository.js.map