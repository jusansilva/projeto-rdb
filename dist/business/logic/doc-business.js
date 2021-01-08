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
var readline = require("readline");
let DocBusiness = class DocBusiness {
    constructor(container) {
        this.bilhetagemRepository = container.get(repositories_1.BilhetagemImportRepository);
        this.gpsRepository = container.get(repositories_1.GpsImportRepository);
        this.realationshipRepository = container.get(repositories_1.RelationshipRepository);
        this.emailUtils = container.get(email_utils_1.EmailUtils);
        process.setMaxListeners(0);
    }
    import(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Inicio  de criação de documentos");
                const gpsDoc = readline.createInterface({
                    input: fs.createReadStream(dto.gps.tempFilePath)
                });
                const bilhetagemDoc = readline.createInterface({
                    input: fs.createReadStream(dto.bilhetagem.tempFilePath)
                });
                gpsDoc.on('line', (gpsLine) => __awaiter(this, void 0, void 0, function* () {
                    let gpsArray = gpsLine.split("\t");
                    let gpsSave = yield this.gpsRepository.create({
                        data_final: gpsArray[0],
                        AVL: gpsArray[2],
                        carro: gpsArray[3],
                        latitude: gpsArray[4],
                        longitude: gpsArray[5],
                        ponto_notavel: gpsArray[6],
                        desc_ponto_notavel: gpsArray[7],
                        linha: gpsArray[8],
                        sentido: gpsArray[9],
                        document: dto.gps.tempFilePath,
                        updatedAt: new Date,
                        createdAt: new Date
                    });
                    console.log(`Gps -  ${gpsSave.carro}`);
                    yield bilhetagemDoc.on('line', (bilhetagemLine) => __awaiter(this, void 0, void 0, function* () {
                        let dados = bilhetagemLine.split(',');
                        if (dados[8] !== undefined) {
                            let bilhetagem = yield this.bilhetagemRepository.create({
                                carro: dados[8],
                                linha: dados[16],
                                data: dados[6],
                                cartaoId: dados[23],
                                transacao: dados[24],
                                sentido: dados[25],
                                document: dto.bilhetagem.tempFilePath,
                                updatedAt: new Date,
                                createdAt: new Date
                            });
                            console.log(`Bilhetagem - ${bilhetagem.carro}`);
                            let bDate;
                            let gDate;
                            bDate = this.dateString2Date(bilhetagem.data.trim().replace("/", "-"));
                            gDate = this.dateString2Date(gpsSave.data_final.trim().replace("/", "-"));
                            if ((gDate === null || gDate === void 0 ? void 0 : gDate.getDate()) === (bDate === null || bDate === void 0 ? void 0 : bDate.getDate())) {
                                if (bDate.getHours() == gDate.getHours()) {
                                    if (bDate.getMinutes() == gDate.getMinutes()) {
                                        if (bDate.getSeconds() > (gDate.getSeconds() - 10) && bDate.getSeconds() < (gDate.getSeconds() + 10)) {
                                            console.log(`criou carro: ${bilhetagem.carro} com AVL: ${gpsSave.AVL}`);
                                            yield this.realationshipRepository.create({
                                                data_gps: gpsSave.data_final,
                                                carro: bilhetagem.carro,
                                                linha: bilhetagem.linha,
                                                AVL: gpsDoc.AVL,
                                                cartaoId: bilhetagem.cartaoId,
                                                transacao: bilhetagem.transacao,
                                                sentido: bilhetagem.sentido,
                                                latitude: gpsDoc.latitude,
                                                longitude: gpsDoc.longitude,
                                                ponto_notavel: gpsDoc.ponto_notavel,
                                                desc_ponto_notavel: gpsDoc.desc_ponto_notavel
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    })); //fechou line bilhetagem
                    bilhetagemDoc.on('error', (e) => {
                        console.error("bilhetagem error:" + e);
                        throw e;
                    });
                })).on('close', () => __awaiter(this, void 0, void 0, function* () {
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
                    fs.unlink(`${name}-relacao.json`, (err) => {
                        if (err)
                            throw err;
                        console.log(`${name}-relacao.json was deleted`);
                    });
                    fs.unlink(dto.bilhetagem.tempFilePath, (err) => {
                        if (err)
                            throw err;
                        console.log(`${dto.bilhetagem.tempFilePath} was deleted`);
                    });
                    fs.unlink(dto.gps.tempFilePath, (err) => {
                        if (err)
                            throw err;
                        console.log(`${dto.gps.tempFilePath} was deleted`);
                    });
                }));
                gpsDoc.on('error', (e) => {
                    console.error("gps error:" + e);
                });
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
    saveRelatioship(bilhetagem, gps, bilhetagemDocument, gpsDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.realationshipRepository.drop();
                console.log("começou a pesquisa bilhetagem");
                console.log("bilhetagem concluida");
                console.log(bilhetagem);
                for (let a = 0; a < bilhetagem.length; a++) {
                    console.log(`rodando ${a} de ${bilhetagem.length}`);
                    console.log("gps pesquisando");
                    let bDate;
                    let gDate;
                    gps.map((gps) => {
                        if (gps.carro === bilhetagem[a].carro) {
                            bDate = this.dateString2Date(bilhetagem[a].data.trim().replace("/", "-"));
                            gDate = this.dateString2Date(gps.data_final.trim().replace("/", "-"));
                            if ((gDate === null || gDate === void 0 ? void 0 : gDate.getDate()) === (bDate === null || bDate === void 0 ? void 0 : bDate.getDate())) {
                                if (bDate.getHours() == gDate.getHours()) {
                                    if (bDate.getMinutes() == gDate.getMinutes()) {
                                        if (bDate.getSeconds() > (gDate.getSeconds() - 10) && bDate.getSeconds() < (gDate.getSeconds() + 10)) {
                                            console.log(`criou carro: ${bilhetagem[a].carro} com AVL: ${gps.AVL}`);
                                            this.realationshipRepository.create({
                                                data_gps: gps.data_final,
                                                carro: bilhetagem[a].carro,
                                                linha: bilhetagem[a].linha,
                                                AVL: gps.AVL,
                                                cartaoId: bilhetagem[a].cartaoId,
                                                transacao: bilhetagem[a].transacao,
                                                sentido: bilhetagem[a].sentido,
                                                latitude: gps.latitude,
                                                longitude: gps.longitude,
                                                ponto_notavel: gps.ponto_notavel,
                                                desc_ponto_notavel: gps.desc_ponto_notavel
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });
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
                console.log("inicio de leitura gps");
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
                console.log("fim de leitura gps");
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
                console.log("inicio de leitura bilhetagem");
                const doc = fs.readFileSync(file.tempFilePath, { encoding: 'utf8' });
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
                console.log("fim de leitura bilhetagem");
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