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
const email_utils_1 = require("../../utils/email-utils");
const email_envs_1 = require("../../adapters/envs/email-envs");
const archiver = require("archiver");
const path = require("path");
const uuid_1 = require("uuid");
let DocBusiness = class DocBusiness {
    constructor(container) {
        this.bilhetagemRepository = container.get(repositories_1.BilhetagemImportRepository);
        this.gpsRepository = container.get(repositories_1.GpsImportRepository);
        this.realationshipRepository = container.get(repositories_1.RelationshipRepository);
        this.emailUtils = container.get(email_utils_1.EmailUtils);
    }
    import(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Inicio  de criação de bilhetagem");
                const bilhetagem = yield this.formatDocBilhetagem(dto.bilhetagem);
                const createDocument = [];
                for (let i = 0; i < bilhetagem.length; i++) {
                    console.log(`${i} de ${bilhetagem.length}`);
                    yield this.bilhetagemRepository.create(Object.assign(Object.assign({}, bilhetagem[i]), { updatedAt: new Date, createdAt: new Date }));
                }
                console.log("fim  de criação de bilhetagem");
                console.log("inicio de criação de gps");
                const gpsDoc = yield this.formatDocGps(dto.gps);
                for (let i = 0; i < gpsDoc.length; i++) {
                    console.log(`${i} de ${gpsDoc.length}`);
                    yield this.gpsRepository.create(Object.assign(Object.assign({}, gpsDoc[i]), { updatedAt: new Date, createdAt: new Date }));
                }
                console.log("fim de criação de gps");
                console.log("iniciando relação");
                yield this.saveRelatioship(undefined, undefined, dto.bilhetagem.tempFilePath, dto.gps.tempFilePath);
                const name = uuid_1.v4();
                const relationship = yield this.realationshipRepository.find();
                if (relationship) {
                    const data = JSON.stringify(relationship);
                    yield fs.writeFileSync(`${name}-relacao.json`, data);
                    const path = yield this.getAttachments(name);
                }
                const text = `Relação documento ${name}-relacao.json concluida com sucesso!`;
                const subject = `Relação de documentos`;
                const filename = `${name}-relacao.json`;
                const sendemail = this.parseEmailDto(text, subject, filename, path);
                yield this.emailUtils.sendEmail(sendemail);
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    find(date, carro) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relationship = yield this.realationshipRepository.find(date, carro);
                return relationship;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    saveRelatioship(date, carro, bilhetagemDocument, gpsDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.realationshipRepository.drop();
                console.log("começou a pesquisa bilhetagem");
                const bilhetagem = yield this.bilhetagemRepository.findRelationship(date, carro, bilhetagemDocument);
                console.log("bilhetagem concluida");
                console.log(bilhetagem);
                for (let a = 0; a < bilhetagem.length; a++) {
                    console.log(`rodando ${a} de ${bilhetagem.length}`);
                    console.log("gps pesquisando");
                    let gps = yield this.gpsRepository.find(undefined, bilhetagem[a].carro, gpsDocument);
                    console.log("gps finalizado");
                    let bDate;
                    let gDate;
                    for (let i = 0; i < gps.length; i++) {
                        bDate = this.dateString2Date(bilhetagem[a].data.trim().replace("/", "-"));
                        gDate = this.dateString2Date(gps[i].data_final.trim().replace("/", "-"));
                        if ((gDate === null || gDate === void 0 ? void 0 : gDate.getDate()) === (bDate === null || bDate === void 0 ? void 0 : bDate.getDate())) {
                            if (bDate.getHours() == gDate.getHours()) {
                                if (bDate.getMinutes() == gDate.getMinutes()) {
                                    if (bDate.getSeconds() > (gDate.getSeconds() - 10) && bDate.getSeconds() < (gDate.getSeconds() + 10)) {
                                        console.log(`criou carro: ${bilhetagem[a].carro} com AVL: ${gps[i].AVL}`);
                                        this.realationshipRepository.create({
                                            data_gps: gps[a].data_final,
                                            carro: bilhetagem[a].carro,
                                            linha: bilhetagem[a].linha,
                                            AVL: gps[i].AVL,
                                            cartaoId: bilhetagem[a].cartaoId,
                                            transacao: bilhetagem[a].transacao,
                                            sentido: bilhetagem[a].sentido,
                                            latitude: gps[i].latitude,
                                            longitude: gps[i].longitude,
                                            ponto_notavel: gps[i].ponto_notavel,
                                            desc_ponto_notavel: gps[i].desc_ponto_notavel
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                console.log('terminou');
                return "dados estao sendo processados";
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    parseEmailDto(text, subject, filename, path) {
        const Attachments = path ? {
            filename: filename,
            path: path
        } : null;
        return {
            remetente: {
                host: email_envs_1.EmailEnvs.host,
                service: email_envs_1.EmailEnvs.service,
                port: email_envs_1.EmailEnvs.port,
                secure: email_envs_1.EmailEnvs.secure,
                auth: {
                    user: email_envs_1.EmailEnvs.auth.user,
                    pass: email_envs_1.EmailEnvs.auth.pass
                }
            },
            destinatario: {
                from: email_envs_1.EmailEnvs.destinatario.from,
                to: email_envs_1.EmailEnvs.destinatario.to,
                subject: subject,
                text: text,
                Attachments
            }
        };
    }
    getAttachments(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const day = date.getDay();
            const month = date.getMonth();
            const year = date.getFullYear();
            const output = fs.createWriteStream(`${name}-relacao.zip`);
            const archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });
            archive.pipe(output);
            const file = `${name}-relacao.json`;
            yield archive.append(fs.createReadStream(file), { name: `${name}-relacao.json` });
            return yield `${name}-relacao.zip`;
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
    formatDocGps(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docGps = fs.readFileSync(file.tempFilePath, { encoding: 'utf-8' });
                const gpsLinhas = docGps.split(/\n/);
                const gpsDto = [];
                for (let i = 0; i < gpsLinhas.length; i++) {
                    const gpsArray = gpsLinhas[i].split("\t");
                    gpsDto.push({
                        data_final: gpsArray[0],
                        AVL: gpsArray[2],
                        carro: gpsArray[3],
                        latitude: gpsArray[4],
                        longitude: gpsArray[5],
                        ponto_notavel: gpsArray[6],
                        desc_ponto_notavel: gpsArray[7],
                        linha: gpsArray[8],
                        sentido: gpsArray[9],
                        document: file.tempFilePath
                    });
                }
                return gpsDto;
            }
            catch (err) {
                throw err;
            }
        });
    }
    formatDocBilhetagem(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(file);
                const doc = fs.readFileSync(file.tempFilePath, { encoding: 'utf8' });
                console.log(doc);
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
                            document: file.tempFilePath
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
    dateString2Date(dateString, convert = false) {
        var dt = dateString === null || dateString === void 0 ? void 0 : dateString.split(/\-|\s/g);
        let time;
        if (dt.length > 3) {
            time = dt[3];
        }
        else {
            time = dt[2];
        }
        return new Date(dt.slice(0, 2).join('-') + ' ' + time);
    }
};
DocBusiness = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [typedi_1.ContainerInstance])
], DocBusiness);
exports.DocBusiness = DocBusiness;
//# sourceMappingURL=doc-business.js.map