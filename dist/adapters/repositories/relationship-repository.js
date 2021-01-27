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
exports.RelationshipRepository = void 0;
const model_1 = require("./model/");
class RelationshipRepository {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relationship = yield model_1.RelationshipModel.create(dto);
                return relationship;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    createMany(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relationship = yield model_1.RelationshipModel.insertMany(dto);
                return relationship;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    find(data, carro) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data !== undefined && carro !== undefined) {
                    return yield model_1.RelationshipModel.find({ "data": data, "carro": carro });
                }
                if (data !== undefined) {
                    return yield model_1.RelationshipModel.find({ "data": data });
                }
                if (carro !== undefined) {
                    return yield model_1.RelationshipModel.find({ "carro": carro });
                }
                return yield model_1.RelationshipModel.find({});
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const drop = yield model_1.RelationshipModel.deleteMany();
                return drop;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.RelationshipRepository = RelationshipRepository;
//# sourceMappingURL=relationship-repository.js.map