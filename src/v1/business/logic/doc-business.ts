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
var readline = require("readline");
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
      const bilhetagemSave = await this.getBilhetagem(dto.bilhetagem);
      console.log("Fim de Bilhetagem")
      console.log("Inicio de Gps")
      await this.getGps(dto.gps);
      console.log("Fim de Bilhetagem");
      
      console.log("limpando base de Relação")
      await this.realationshipRepository.drop();
      console.log("base de relação limpa")
      console.log("Inicio de Relação")
      for (let j = 0; j < bilhetagemSave.length; j++) {
        let relacao = await this.gpsRepository.findRelacao(bilhetagemSave[j]);
        console.log(relacao);
        if (relacao) {
          console.log(`criou carro: ${bilhetagemSave[j].carro} com AVL: ${relacao.AVL}`);
          await this.realationshipRepository.create(
            {
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
            })


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


    } catch (err) {
      console.log(err)
      throw err;
    }

  }

  public async getBilhetagem(bilhetagemFile: FileTemp): Promise<IBilhetagemImportModel[]> {
    try {
      const bilhetagemSave: IBilhetagemImportModel[] = []
      const fileStream = fs.createReadStream(bilhetagemFile.tempFilePath);

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      for await (const line of rl) {
        let forReplace = line.replace(/[""]/g, "");
        let dados = forReplace.split(',');
        let bilhetagem: BilhetagemDto = {
          carro: dados[8],
          linha: dados[16],
          data: new Date(dados[6].trim() + " GMT"),
          cartaoId: dados[23],
          transacao: dados[24],
          sentido: dados[25],
          document: bilhetagemFile.tempFilePath,
          updatedAt: new Date,
          createdAt: new Date
        }
        if (dados[8] !== undefined) {
          bilhetagemSave.push(await this.bilhetagemRepository.create(bilhetagem));
        }
      }
      return await bilhetagemSave;

    } catch (error) {
      console.log(error)
      throw error
    }
  }


  public async getGps(gpsFile: FileTemp): Promise<any> {
    try {

      const gpsSave: IGpsImportModel[] = [];
      const fileStream = fs.createReadStream(gpsFile.tempFilePath);

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });
      let i = 0;
      for await (const line of rl) {
        i++
        let gpsArray = line.split("\t");
        gpsSave.push(await this.gpsRepository.create({
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

      return await i;
    } catch (error) {
      console.log(error)
      throw error
    }

  }

  public async find(date?: string, carro?: string): Promise<RelationshipDto[]> {
    try {
      const relationship = await this.realationshipRepository.find(date, carro);
      return relationship;
    } catch (error) {
      console.log(error)
      throw error
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
        Attachments
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





}