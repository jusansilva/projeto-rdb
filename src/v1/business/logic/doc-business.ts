import { Container, Service, ContainerInstance } from "typedi";
import * as fs from "fs";
import { ImportDto, BilhetagemDto, GpsImportDto, RelationshipDto, FileTemp } from "../../adapters/dtos/import-dto";
import { BilhetagemImportRepository, GpsImportRepository, RelationshipRepository } from "../../adapters/repositories";
import { BilhetagemImportModel, IBilhetagemImportModel } from "../../adapters/repositories/model/bilhetagem-import-model";
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
const readline = require('linebyline');
const lineReader = require('line-reader');
require('events').EventEmitter.prototype._maxListeners = 1000000000;

@Service()
export class DocBusiness {
  protected readonly bilhetagemRepository: BilhetagemImportRepository;
  protected readonly gpsRepository: GpsImportRepository;
  protected readonly realationshipRepository: RelationshipRepository;
  protected readonly emailUtils: EmailUtils;
  protected readonly uuid: string;
  constructor(container: ContainerInstance) {
    this.bilhetagemRepository = container.get(BilhetagemImportRepository);
    this.gpsRepository = container.get(GpsImportRepository)
    this.realationshipRepository = container.get(RelationshipRepository);
    this.emailUtils = container.get(EmailUtils);
    this.uuid = uuid();

  }

  public async import(dto: ImportDto): Promise<void> {
    try {
      console.log("Inicio  de criação de documentos");
      console.log("Salvando docs")
      let bilhetagemCount = 0;
      let j = 0
      const bilhetes = fs.readFileSync(dto.bilhetagem.tempFilePath, 'utf-8').toString().split(/\n/);
      let bisave: BilhetagemDto[] = []
      for (const bilhete of bilhetes) {
        bilhetagemCount++;
        j++;
        let forReplace = bilhete.replace(/[""]/g, "");
        let dados = forReplace.split(',');
        if (dados[22]) {
          bisave.push({
            carro: dados[8],
            linha: dados[16],
            data: new Date(dados[22] + " GMT"),
            cartaoId: dados[23],
            transacao: dados[24],
            sentido: dados[25],
            document: `${this.uuid}-${dto.bilhetagem.name}`,
            updatedAt: new Date,
            createdAt: new Date
          })
          if (bilhetagemCount === 1000 || j == bilhetes.length - 1) {
            await this.bilhetagemRepository.createMany(bisave);
            console.log(`${j} bilhetagem salvos`)
            bilhetagemCount = 0;
            bisave = [];
          }
        }
      }


      const gps = fs.readFileSync(dto.gps.tempFilePath).toString().split(/\n/)
      let save: GpsImportDto[] = []
      let gpsCount = 0;
      let i = 0
      console.log(gps.length);
      for (const line of gps) {
        gpsCount++;
        i++;
        let gpsArray = line.split(/[\t\n]/);
        if (gpsArray[0]) {

          save.push({
            data_final: new Date(gpsArray[0] + " GMT"),
            AVL: gpsArray[2],
            carro: gpsArray[3],
            latitude: gpsArray[4],
            longitude: gpsArray[5],
            ponto_notavel: gpsArray[6],
            desc_ponto_notavel: gpsArray[7],
            linha: gpsArray[8],
            sentido: gpsArray[9],
            document: `${this.uuid}-${dto.gps.name}`,
            updatedAt: new Date,
            createdAt: new Date
          })

          if (gpsCount === 100000 || i == gps.length) {
            await this.gpsRepository.createMany(save);
            console.log(`${i} Gps salvos`)
            gpsCount = 0;
            save = [];
          }

        }
      }
      console.log("Fim de docs")
      console.log("limpando base de Relação")
      await this.realationshipRepository.drop();
      console.log("base de relação limpa")
      console.log("Inicio de Relação")
      const bilhetagemSave = await this.bilhetagemRepository.findDocument(`${this.uuid}-${dto.bilhetagem.name}`);
      for (const bilhetegemON of bilhetagemSave) {
        let relacao = await this.gpsRepository.findRelacao(bilhetegemON, `${this.uuid}-${dto.gps.name}`);
        if (relacao) {
          console.log(`criou carro: ${bilhetegemON.carro} com AVL: ${relacao.AVL}`);

          await this.realationshipRepository.create({
            data_gps: `${this.adicionaZero(relacao.data_final.getDay())}/${this.adicionaZero(relacao.data_final.getMonth() + 1)}/${relacao.data_final.getFullYear()} ${this.adicionaZero(relacao.data_final.getHours())}:${this.adicionaZero(relacao.data_final.getMinutes())}:${this.adicionaZero(relacao.data_final.getSeconds())}`,
            carro: bilhetegemON.carro,
            linha: bilhetegemON.linha,
            AVL: relacao.AVL,
            cartaoId: bilhetegemON.cartaoId,
            transacao: bilhetegemON.transacao,
            sentido: bilhetegemON.sentido,
            latitude: relacao.latitude,
            longitude: relacao.longitude,
            ponto_notavel: relacao.ponto_notavel,
            desc_ponto_notavel: relacao.desc_ponto_notavel
          });
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
        pool: true,
        host: EmailEnvs.host,
        // service: EmailEnvs.service,
        port: EmailEnvs.port,
        secureConnection: false,
        secure: true,
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
        tls: {
          ciphers: 'SSLv3',
          secure: false,
          ignoreTLS: true,
          rejectUnauthorized: false
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