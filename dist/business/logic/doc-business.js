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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
require('events').EventEmitter.prototype._maxListeners = 1000000000;
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
                console.log("Inicio  de criação de documentos");
                console.log("Inicio de Bilhetagem");
                const bilhetagemSave = yield this.getBilhetagem(dto.bilhetagem);
                console.log("Fim de Bilhetagem");
                console.log("Inicio de Gps");
                yield this.getGps(dto.gps);
                console.log("Fim de Bilhetagem");
                console.log("limpando base de Relação");
                yield this.realationshipRepository.drop();
                console.log("base de relação limpa");
                console.log("Inicio de Relação");
                for (let j = 0; j < bilhetagemSave.length; j++) {
                    let relacao = yield this.gpsRepository.findRelacao(bilhetagemSave[j]);
                    console.log(relacao);
                    if (relacao) {
                        console.log(`criou carro: ${bilhetagemSave[j].carro} com AVL: ${relacao.AVL}`);
                        yield this.realationshipRepository.create({
                            data_gps: relacao.data_final,
                            carro: bilhetagemSave[j].carro,
                            linha: bilhetagemSave[j].linha,
                            AVL: relacao.AVL,
                            cartaoId: bilhetagemSave[j].cartaoId,
                            transacao: bilhetagemSave[j].transacao,
                            sentido: bilhetagemSave[j].sentido,
                            latitude: relacao.latitude,
                            longitude: relacao.longitude,
                            ponto_notavel: relacao.ponto_notavel,
                            desc_ponto_notavel: relacao.desc_ponto_notavel
                        });
                    }
                }
                console.log("Fim de Relação");
                const name = uuid_1.v4();
                console.log("Busca de Relação");
                const relationship = yield this.realationshipRepository.find();
                console.log(`Relações encontradas: ${relationship.length}`);
                let text = ``;
                let subject = ``;
                let filename = "";
                if (relationship.length > 1) {
                    const data = JSON.stringify(relationship);
                    yield fs.writeFileSync(`${name}-relacao.json`, data);
                    const path = yield this.getAttachments(name);
                    text = `Relação documento ${name}-relacao.json concluida com sucesso!`;
                    subject = `Relação de documentos`;
                    filename = `${name}-relacao.json`;
                }
                else {
                    text = `Nenhuma relação encontrada. Processo concluido com sucesso!`;
                    subject = `Relação de documentos`;
                    filename = null;
                }
                console.log(" Preparando email");
                const sendemail = yield this.parseEmailDto(text, subject, filename, path);
                yield this.emailUtils.sendEmail(sendemail);
                //      await fs.unlink(`${name}-relacao.json`, (err) => {
                //        if (err) throw err;
                //        console.log(`${name}-relacao.json was deleted`);
                //      });
                //     await fs.unlink(dto.bilhetagem.tempFilePath, (err) => {
                //       if (err) throw err;
                //      console.log(`${dto.bilhetagem.tempFilePath} was deleted`);
                //     });
                //     await fs.unlink(dto.gps.tempFilePath, (err) => {
                //       if (err) throw err;
                //       console.log(`${dto.gps.tempFilePath} was deleted`);
                //     });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    getBilhetagem(bilhetagemFile) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bilhetagemSave = [];
                const fileStream = fs.createReadStream(bilhetagemFile.tempFilePath);
                const rl = readline.createInterface({
                    input: fileStream,
                    crlfDelay: Infinity
                });
                try {
                    for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                        const line = rl_1_1.value;
                        let forReplace = line.replace(/[""]/g, "");
                        let dados = forReplace.split(',');
                        let bilhetagem = {
                            carro: dados[8],
                            linha: dados[16],
                            data: new Date(dados[6].trim() + " GMT"),
                            cartaoId: dados[23],
                            transacao: dados[24],
                            sentido: dados[25],
                            document: bilhetagemFile.tempFilePath,
                            updatedAt: new Date,
                            createdAt: new Date
                        };
                        if (dados[8] !== undefined) {
                            bilhetagemSave.push(yield this.bilhetagemRepository.create(bilhetagem));
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (rl_1_1 && !rl_1_1.done && (_a = rl_1.return)) yield _a.call(rl_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return yield bilhetagemSave;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getGps(gpsFile) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gpsSave = [];
                const fileStream = fs.createReadStream(gpsFile.tempFilePath);
                const rl = readline.createInterface({
                    input: fileStream,
                    crlfDelay: Infinity
                });
                let i = 0;
                try {
                    for (var rl_2 = __asyncValues(rl), rl_2_1; rl_2_1 = yield rl_2.next(), !rl_2_1.done;) {
                        const line = rl_2_1.value;
                        i++;
                        console.log(i);
                        let gpsArray = line.split("\t");
                        gpsSave.push(yield this.gpsRepository.create({
                            data_final: new Date(gpsArray[0].trim() + " GMT"),
                            AVL: gpsArray[2],
                            carro: gpsArray[3],
                            latitude: gpsArray[4],
                            longitude: gpsArray[5],
                            ponto_notavel: gpsArray[6],
                            desc_ponto_notavel: gpsArray[7],
                            linha: gpsArray[8],
                            sentido: gpsArray[9],
                            document: gpsFile.tempFilePath,
                            updatedAt: new Date,
                            createdAt: new Date
                        }));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (rl_2_1 && !rl_2_1.done && (_a = rl_2.return)) yield _a.call(rl_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return yield i;
            }
            catch (error) {
                console.log(error);
                throw error;
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
};
DocBusiness = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [typedi_1.ContainerInstance])
], DocBusiness);
exports.DocBusiness = DocBusiness;
//# sourceMappingURL=doc-business.js.map