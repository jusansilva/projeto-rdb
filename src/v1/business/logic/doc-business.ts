import { Container, Service, ContainerInstance } from "typedi";
import * as fs from "fs";
import { ImportDto, BilhetagemDto, GpsImportDto, RelationshipDto, FileTemp } from "../../adapters/dtos/import-dto";
import { BilhetagemImportRepository, GpsImportRepository, RelationshipRepository } from "../../adapters/repositories";
import { IBilhetagemImportModel } from "../../adapters/repositories/model/bilhetagem-import-model";
import { IRelationshipModel, IGpsImportModel } from "../../adapters/repositories/model";
import { EmailUtils } from "../../utils/email-utils";
import { EmailDto } from "../../adapters/dtos";
import { EmailEnvs } from "../../adapters/envs/email-envs";
import * as archiver from 'archiver';
import * as  path from "path";
import { v4 as uuid } from 'uuid';
import { resolve } from "path";
import { rejects } from "assert";
import { UserBusinessDelegate } from "../delegate";
var readline = require("readline");
const lineReader = require('line-reader');
require('events').EventEmitter.prototype._maxListeners = 1000000000;

@Service()
export class DocBusiness {
  protected readonly bilhetagemRepository: BilhetagemImportRepository;
  protected readonly gpsRepository: GpsImportRepository;
  protected readonly realationshipRepository: RelationshipRepository;
  protected readonly emailUtils: EmailUtils;
  constructor(container: ContainerInstance) {
    this.bilhetagemRepository = container.get(BilhetagemImportRepository);
    this.gpsRepository = container.get(GpsImportRepository)
    this.realationshipRepository = container.get(RelationshipRepository);
    this.emailUtils = container.get(EmailUtils);

  }

  public async import(dto: ImportDto): Promise<void> {
    try {
      console.log("Inicio  de criação de documentos");
      console.log("Inicio de Bilhetagem")
      await Promise.all(await this.getBilhetagem(dto.bilhetagem));
      console.log("Fim de Bilhetagem")
      console.log("Inicio de Gps")
      await Promise.all(await this.getGps(dto.gps));
      console.log("Fim de Fim de GPS");
      console.log("limpando base de Relação")
      await this.realationshipRepository.drop();
      console.log("base de relação limpa")
      console.log("Inicio de Relação")
      const bilhetagemSave = await this.bilhetagemRepository.findDocument(dto.bilhetagem.name);

      let relacoes: RelationshipDto[] = [];
      for (let j = 0; j < bilhetagemSave.length; j++) {
        let relacao = await this.gpsRepository.findRelacao(bilhetagemSave[j], dto.gps.name);
        console.log(relacao, j)
        if (relacao) {
          console.log(`criou carro: ${bilhetagemSave[j].carro} com AVL: ${relacao.AVL}`);

          relacoes.push(
            {
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
            await this.realationshipRepository.createMany(relacoes);
            break;
          }

          if (relacoes.length > 20) {
            await this.realationshipRepository.createMany(relacoes);
            relacoes = [];
          }


        }
      }

      console.log("Fim de Relação")



      const name = uuid();
      console.log("Busca de Relação")
      const relationship = await this.realationshipRepository.find();
      console.log(`Relações encontradas: ${relationship.length}`);
      let text = ``
      let subject = ``;
      let filename = "";
      if (relationship.length > 1) {
        const data = JSON.stringify(relationship);
        await fs.writeFileSync(`${name}-relacao.json`, data);
        const path = await this.getAttachments(name);
        text = `Relação documento ${name}-relacao.json concluida com sucesso!`
        subject = `Relação de documentos`;
        filename = `${name}-relacao.json`
      } else {
        text = `Nenhuma relação encontrada. Processo concluido com sucesso!`
        subject = `Relação de documentos`;
        filename = null;
      }

      console.log(" Preparando email");

      const sendemail = await this.parseEmailDto(text, subject, filename, path);
      await this.emailUtils.sendEmail(sendemail);

    } catch (err) {
      console.log(err)
      throw err;
    }

  }

  public getBilhetagem(bilhetagemFile: FileTemp): any {
    try {
      const firstName = uuid();
      let bilhetagemSave: BilhetagemDto[] = []
      const bilhetagemRetorno: IBilhetagemImportModel[] = [];
      let i = 0;
      return lineReader.eachLine(bilhetagemFile.tempFilePath, async (line, last) => {
          let forReplace = line.replace(/[""]/g, "");
          let dados = forReplace.split(',');
          i++;
          let bilhetagem: BilhetagemDto = {
            carro: dados[8],
            linha: dados[16],
            data: new Date(dados[22].trim() + " GMT"),
            cartaoId: dados[23],
            transacao: dados[24],
            sentido: dados[25],
            document: `${firstName}-${bilhetagemFile.name}`,
            updatedAt: new Date,
            createdAt: new Date
          }
          bilhetagemSave.push(bilhetagem);

          if (last) {
            const retorno = await this.bilhetagemRepository.createMany(bilhetagemSave);
            await retorno.map(bilhetagem => {
              bilhetagemRetorno.push(bilhetagem);
            })
            while (bilhetagemSave.length) {
              bilhetagemSave.pop();
            }
            console.log(`${i} Bilhetagem foram salvos`)
            return bilhetagemRetorno;
          }

          if (bilhetagemSave.length == 100) {
            await this.bilhetagemRepository.createMany(bilhetagemSave)
            while (bilhetagemSave.length) {
              bilhetagemSave.pop();
            }
          }

      })

    } catch (error) {
      console.log(error)
      throw error
    }
  }


  public getGps(gpsFile: FileTemp): any {
    try {
      let i = 0;
      let count = 0;
      const nameId = uuid();
      const gpsSave: IGpsImportModel[] = [];
      let gpstransfer: GpsImportDto[] = [];
      const fileStream = fs.createReadStream(gpsFile.tempFilePath);
      return lineReader.eachLine(gpsFile.tempFilePath, async (line, last) => {
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
            let save = await this.gpsRepository.createMany(gpstransfer);
            count = count + gpstransfer.length;
            while (gpstransfer.length) {
              gpstransfer.pop();
            }
            console.log(`${count} gps salvos`)
            return false;
          }

          if (gpstransfer.length == 100) {
            count = count + 100;
            await this.gpsRepository.createMany(gpstransfer);
            console.log(`${count} gps momentaneo`)
            while (gpstransfer.length) {
              gpstransfer.pop();
            }
          }
        });
    } catch (error) {
      console.log(error)
      throw error
    }

  }

  public async find(date?: string, carro?: string): Promise<RelationshipDto[]> {
    try {
      const relationship = await this.realationshipRepository.find(date, carro);
      const relacao = relationship.map(rel => this.parseRelacaoDto(rel))

      return relacao;
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public parseRelacaoDto(model: IRelationshipModel): RelationshipDto {
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
    }
  }

  public parseEmailDto(text: string, subject: string, filename: string, path?: any): EmailDto {
    const Attachments = path ? {
      filename: filename,
      path: path
    } : null;
    return {
      remetente: {
        host: EmailEnvs.host,
        service: EmailEnvs.service,
        port: EmailEnvs.port,
        secure: EmailEnvs.secure,
        auth: {
          user: EmailEnvs.auth.user,
          pass: EmailEnvs.auth.pass
        }
      },
      destinatario: {
        from: EmailEnvs.destinatario.from,
        to: EmailEnvs.destinatario.to,
        subject: subject,
        text: text,
        Attachments,
        tls:{
          ciphers: 'SSLv3'
        } 
      }
    }
  }

  public async getAttachments(name: string): Promise<string> {
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
    await archive.append(fs.createReadStream(file), { name: `${name}-relacao.json` });

    return await `${name}-relacao.zip`
  }


  public parseDto(model: IBilhetagemImportModel): BilhetagemDto {
    return {
      carro: model.carro,
      linha: model.linha,
      data: model.data,
      cartaoId: model.cartaoId,
      transacao: model.transacao,
      sentido: model.sentido
    }
  }
  public adicionaZero(numero) {
    if (numero <= 9)
      return "0" + numero;
    else
      return numero;
  }






}