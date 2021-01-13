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
exports.BilhetagemImportRepository = void 0;
const model_1 = require("./model");
class BilhetagemImportRepository {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bilhetagem = yield model_1.BilhetagemImportModel.create(dto);
                return bilhetagem;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMany(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bilhetagem = yield model_1.BilhetagemImportModel.insertMany(dto);
                return bilhetagem;
            }
            catch (error) {
                throw error;
            }
        });
    }
    find(data, carro) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data !== undefined && carro !== undefined) {
                    return yield model_1.BilhetagemImportModel.find({ "data": data, "carro": carro });
                }
                if (data !== undefined && carro === undefined) {
                    return yield model_1.BilhetagemImportModel.find({ "data": data });
                }
                if (carro !== undefined && data === undefined) {
                    return yield model_1.BilhetagemImportModel.find({ "carro": carro });
                }
                return yield model_1.BilhetagemImportModel.find();
            }
            catch (err) {
                throw err;
            }
        });
    }
    findDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const model = yield model_1.BilhetagemImportModel.find({ document: document });
                return model;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findRelationship(date, carro, document) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gpsModel = model_1.GpsImportModel;
                console.log(document);
                console.log(date, carro);
                if (date !== undefined && carro !== undefined) {
                    return model_1.BilhetagemImportModel.aggregate([
                        {
                            "date": date, "carro": carro, document: document
                        },
                        {
                            $lookup: {
                                from: gpsModel.collection.carro,
                                localField: 'carro',
                                foreignField: 'carro',
                                as: 'relatioship'
                            }
                        }
                    ]);
                }
                if (date !== undefined) {
                    return model_1.BilhetagemImportModel.find({ "data": date, document: document });
                }
                if (carro !== undefined) {
                    return model_1.BilhetagemImportModel.find({ "carro": carro, document: document });
                }
                const bilhetagem = model_1.BilhetagemImportModel.find({ document: document });
                console.log(bilhetagem);
                return bilhetagem;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.BilhetagemImportRepository = BilhetagemImportRepository;
//# sourceMappingURL=bilhetagem-import-repository.js.map