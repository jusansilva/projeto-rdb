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
exports.DocBusiness = void 0;
const typedi_1 = require("typedi");
const fs = require("fs");
const repositories_1 = require("../../adapters/repositories");
let DocBusiness = class DocBusiness {
    constructor(container) {
        this.bilhetagemRepository = container.get(repositories_1.BilhetagemImportRepository);
    }
    import(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (dto.type) {
                    case 'bilhetagem':
                        const bilhetagem = yield this.formatDocBilhetagem(dto.data);
                        const createDocument = [];
                        for (let i = 0; i < bilhetagem.length; i++) {
                            console.log(i);
                            createDocument.push(yield this.bilhetagemRepository.create(Object.assign(Object.assign({}, bilhetagem[i]), { updatedAt: new Date, createdAt: new Date })));
                        }
                        const documentDto = createDocument.map(create => this.parseDto(create));
                        return documentDto[documentDto.length];
                    case 'gps':
                        const gpsDoc = yield this.formatDocGps(dto.data);
                    default:
                        break;
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    parseDto(model) {
        return {
            carro: model.carro,
            linha: model.linha,
            data: model.data,
            cartaoId: model.cartaoId,
            transacao: model.transacao,
            sentido: model.sentido
        };
    }
    formatDocGps(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docGps = fs.readFileSync(path, { encoding: 'utf-8' });
                const gpsLinhas = docGps.split(/\n/);
                const gpsDto = [];
                for (let i = 0; i > gpsLinhas.length; j++) {
                    const gpsArray = docGps[i].split("\t");
                    gpsDto.push({
                        data_final: gpsArray[0],
                        AVL: gpsArray[2],
                        carro: gpsArray[3],
                        latitude: gpsArray[4],
                        longitude: gpsArray[5],
                        ponto_notavel: gpsArray[6],
                        desc_ponto_notavel: gpsArray[7],
                        linha: gpsArray[8],
                        sentido: gpsArray[9]
                    });
                }
                return gpsDto;
            }
            catch (err) {
                throw err;
            }
        });
    }
    formatDocBilhetagem(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = fs.readFileSync(path, { encoding: 'utf8' });
                const documentArray = doc.replace(/["]/g, '').split(/\n/);
                const arrayDocument = [];
                for (let i = 0; i < documentArray.length; i++) {
                    let dados = documentArray[i].split(',');
                    if (dados[8] !== undefined) {
                        arrayDocument.push({
                            carro: dados[8],
                            linha: dados[16],
                            data: dados[6],
                            cartaoId: dados[23],
                            transacao: dados[24],
                            sentido: dados[25],
                        });
                    }
                }
                return arrayDocument;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
DocBusiness = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [typedi_1.ContainerInstance])
], DocBusiness);
exports.DocBusiness = DocBusiness;
//# sourceMappingURL=doc-business.js.map