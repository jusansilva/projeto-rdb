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
const lineReader = require('line-reader');
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
                yield Promise.all(yield this.getBilhetagem(dto.bilhetagem));
                console.log("Fim de Bilhetagem");
                console.log("Inicio de Gps");
                yield Promise.all(yield this.getGps(dto.gps));
                console.log("Fim de Fim de GPS");
                console.log("limpando base de Relação");
                yield this.realationshipRepository.drop();
                console.log("base de relação limpa");
                console.log("Inicio de Relação");
                const bilhetagemSave = yield this.bilhetagemRepository.findDocument(dto.bilhetagem.name);
                let relacoes = [];
                for (let j = 0; j < bilhetagemSave.length; j++) {
                    let relacao = yield this.gpsRepository.findRelacao(bilhetagemSave[j], dto.gps.name);
                    console.log(relacao, j);
                    if (relacao) {
                        console.log(`criou carro: ${bilhetagemSave[j].carro} com AVL: ${relacao.AVL}`);
                        relacoes.push({
                            data_gps: `${this.adicionaZero(relacao.data_final.getDay())}/${this.adicionaZero(relacao.data_final.getMonth() + 1)}/${relacao.data_final.getFullYear()} ${this.adicionaZero(relacao.data_final.getHours())}:${this.adicionaZero(relacao.data_final.getMinutes())}:${this.adicionaZero(relacao.data_final.getSeconds())}`,
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
                        if (j === bilhetagemSave.length) {
                            yield this.realationshipRepository.createMany(relacoes);
                            break;
                        }
                        if (relacoes.length > 20) {
                            yield this.realationshipRepository.createMany(relacoes);
                            relacoes = [];
                        }
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
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    getBilhetagem(bilhetagemFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const firstName = uuid_1.v4();
                let bilhetagemSave = [];
                const bilhetagemRetorno = [];
                let i = 0;
                return new Promise((resolve, rejects) => {
                    lineReader.eachLine(bilhetagemFile.tempFilePath, (line, last) => __awaiter(this, void 0, void 0, function* () {
                        let forReplace = line.replace(/[""]/g, "");
                        let dados = forReplace.split(',');
                        i++;
                        let bilhetagem = {
                            carro: dados[8],
                            linha: dados[16],
                            data: new Date(dados[22].trim() + " GMT"),
                            cartaoId: dados[23],
                            transacao: dados[24],
                            sentido: dados[25],
                            document: `${firstName}-${bilhetagemFile.name}`,
                            updatedAt: new Date,
                            createdAt: new Date
                        };
                        bilhetagemSave.push(bilhetagem);
                        if (last) {
                            const retorno = yield this.bilhetagemRepository.createMany(bilhetagemSave);
                            yield retorno.map(bilhetagem => {
                                bilhetagemRetorno.push(bilhetagem);
                            });
                            while (bilhetagemSave.length) {
                                bilhetagemSave.pop();
                            }
                            console.log(`${i} Bilhetagem foram salvos`);
                            return bilhetagemRetorno;
                        }
                        if (bilhetagemSave.length == 100) {
                            yield this.bilhetagemRepository.createMany(bilhetagemSave);
                            while (bilhetagemSave.length) {
                                bilhetagemSave.pop();
                            }
                        }
                    }));
                    resolve(bilhetagemRetorno);
                });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getGps(gpsFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let i = 0;
                let count = 0;
                const nameId = uuid_1.v4();
                const gpsSave = [];
                let gpstransfer = [];
                const fileStream = fs.createReadStream(gpsFile.tempFilePath);
                return new Promise((resolve, rejects) => {
                    lineReader.eachLine(gpsFile.tempFilePath, (line, last) => __awaiter(this, void 0, void 0, function* () {
                        let gpsArray = line.split("\t");
                        i++;
                        gpstransfer.push({
                            data_final: new Date(gpsArray[0].trim() + " GMT"),
                            AVL: gpsArray[2],
                            carro: gpsArray[3],
                            latitude: gpsArray[4],
                            longitude: gpsArray[5],
                            ponto_notavel: gpsArray[6],
                            desc_ponto_notavel: gpsArray[7],
                            linha: gpsArray[8],
                            sentido: gpsArray[9],
                            document: `${nameId}-${gpsFile.name}`,
                            updatedAt: new Date,
                            createdAt: new Date
                        });
                        if (last) {
                            let save = yield this.gpsRepository.createMany(gpstransfer);
                            count = count + gpstransfer.length;
                            while (gpstransfer.length) {
                                gpstransfer.pop();
                            }
                            const contaFinal = (i * 100) + gpstransfer.length;
                            console.log(`${contaFinal} , conta do I`);
                            console.log(`${count} gps salvos`);
                        }
                        if (gpstransfer.length == 100) {
                            count = count + 100;
                            let save = yield this.gpsRepository.createMany(gpstransfer);
                            while (gpstransfer.length) {
                                gpstransfer.pop();
                            }
                        }
                    }));
                });
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
                const relacao = relationship.map(rel => this.parseRelacaoDto(rel));
                return relacao;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    parseRelacaoDto(model) {
        return {
            data_gps: model.data_gps,
            carro: model.carro,
            linha: model.linha,
            AVL: model.AVL,
            cartaoId: model.cartaoId,
            transacao: model.transacao,
            sentido: model.sentido,
            latitude: model.latitude,
            longitude: model.longitude,
            ponto_notavel: model.ponto_notavel,
            desc_ponto_notavel: model.desc_ponto_notavel
        };
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
    adicionaZero(numero) {
        if (numero <= 9)
            return "0" + numero;
        else
            return numero;
    }
};
DocBusiness = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [typedi_1.ContainerInstance])
], DocBusiness);
exports.DocBusiness = DocBusiness;
//# sourceMappingURL=doc-business.js.map