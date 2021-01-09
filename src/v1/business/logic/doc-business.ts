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
var readline = require("line-by-line");
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

      const gpsDoc = new readline(dto.gps.tempFilePath);
      const bilhetagemDoc = new readline(dto.bilhetagem.tempFilePath);
      const gpsSave = [];
      const bilhetagemSave = []
      gpsDoc.on('line', async (gpsLine) => {
       
        let gpsArray = gpsLine.split("\t");
        gpsSave.push(await this.gpsRepository.create({
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
        }));
      })//fim gps
      
        console.log("Fim de GPS")
        
        bilhetagemDoc.on('error', (e) => {
          console.error("bilhetagem error:" + e)
          throw e;
        });
        
        bilhetagemDoc.on('line', async (bilhetagemLine) => {
          console.log("Inicio de Bilhetagem")
          
          let forReplace = bilhetagemLine.replace(/[""]/g, "");
          let dados = forReplace.split(',');
          let bilhetagem: BilhetagemDto = {
            carro: dados[8],
            linha: dados[16],
            data: dados[6],
            cartaoId: dados[23],
            transacao: dados[24],
            sentido: dados[25],
            document: dto.bilhetagem.tempFilePath,
            updatedAt: new Date,
            createdAt: new Date
          }
          bilhetagemDoc.pause();

          if (dados[8] !== undefined) {
            bilhetagemSave.push(await this.bilhetagemRepository.create(bilhetagem));
            console.log(`Bilhetagem - ${dados}`)
          }
          bilhetagemDoc.resume();
          gpsDoc.on('error', (e) => {
            console.error("gps error:" + e)
          });

        }); //fechou line bilhetagem

      gpsDoc.on('end', async () => {
        console.log("Fim de Bilhetagem")

        console.log("Inicio de Relação")
        for (let i = 0; i < gpsSave.length; i++) {
          for (let j = 0; j < bilhetagemSave.length; j++) {
            let bDate;
            let gDate;
            bDate = this.dateString2Date(bilhetagemSave[j].data.trim().replace("/", "-"));
            gDate = this.dateString2Date(gpsSave[i].data_final.trim().replace("/", "-"));
            if (gDate?.getDate() === bDate?.getDate()) {
              if (bDate.getHours() == gDate.getHours()) {
                if (bDate.getMinutes() == gDate.getMinutes()) {
                  if (bDate.getSeconds() > (gDate.getSeconds() - 10) && bDate.getSeconds() < (gDate.getSeconds() + 10)) {
                    console.log(`criou carro: ${bilhetagemSave[j].carro} com AVL: ${gpsSave[i].AVL}`);
                    await this.realationshipRepository.create(
                      {
                        data_gps: gpsSave[i].data_final,
                        carro: bilhetagemSave[j].carro,
                        linha: bilhetagemSave[j].linha,
                        AVL: gpsSave[i].AVL,
                        cartaoId: bilhetagemSave[j].cartaoId,
                        transacao: bilhetagemSave[j].transacao,
                        sentido: bilhetagemSave[j].sentido,
                        latitude: gpsSave[i].latitude,
                        longitude: gpsSave[i].longitude,
                        ponto_notavel: gpsSave[i].ponto_notavel,
                        desc_ponto_notavel: gpsSave[i].desc_ponto_notavel
                      })

                  }
                }
              }
            }
          }
        }


        const name = uuid();
        const relationship = await this.realationshipRepository.find();
        if (relationship) {
          const data = JSON.stringify(relationship);
          await fs.writeFileSync(`${name}-relacao.json`, data);
          const path = await this.getAttachments(name);
        }
        const text = `Relação documento ${name}-relacao.json concluida com sucesso!`
        const subject = `Relação de documentos`;
        const filename = `${name}-relacao.json`
        const sendemail = this.parseEmailDto(text, subject, filename, path);
        await this.emailUtils.sendEmail(sendemail);

        fs.unlink(`${name}-relacao.json`, (err) => {
          if (err) throw err;
          console.log(`${name}-relacao.json was deleted`);
        });

        fs.unlink(dto.bilhetagem.tempFilePath, (err) => {
          if (err) throw err;
          console.log(`${dto.bilhetagem.tempFilePath} was deleted`);
        });

        fs.unlink(dto.gps.tempFilePath, (err) => {
          if (err) throw err;
          console.log(`${dto.gps.tempFilePath} was deleted`);
        });
      });


    } catch (err) {
      console.log(err)
      throw err;
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

  public async saveRelatioship(bilhetagem: IBilhetagemImportModel[], gps: IGpsImportModel[], bilhetagemDocument?: string, gpsDocument?: string): Promise<string> {
    try {
      await this.realationshipRepository.drop();
      console.log("começou a pesquisa bilhetagem");
      console.log("bilhetagem concluida");
      console.log(bilhetagem);
      for (let a = 0; a < bilhetagem.length; a++) {
        console.log(`rodando ${a} de ${bilhetagem.length}`)
        console.log("gps pesquisando")
        let bDate;
        let gDate;
        gps.map((gps) => {
          if (gps.carro === bilhetagem[a].carro) {
            bDate = this.dateString2Date(bilhetagem[a].data.trim().replace("/", "-"));
            gDate = this.dateString2Date(gps.data_final.trim().replace("/", "-"));
            if (gDate?.getDate() === bDate?.getDate()) {
              if (bDate.getHours() == gDate.getHours()) {
                if (bDate.getMinutes() == gDate.getMinutes()) {
                  if (bDate.getSeconds() > (gDate.getSeconds() - 10) && bDate.getSeconds() < (gDate.getSeconds() + 10)) {
                    console.log(`criou carro: ${bilhetagem[a].carro} com AVL: ${gps.AVL}`);
                    this.realationshipRepository.create(
                      {
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
                      })
                  }
                }
              }
            }
          }
        })
      }
      console.log('terminou')

      return "dados estao sendo processados";

    } catch (error) {
      console.log(error);
      throw error;
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

  public async formatDocGps(file: FileTemp): Promise<GpsImportDto[]> {
    try {
      console.log("inicio de leitura gps");
      const docGps = fs.readFileSync(file.tempFilePath, { encoding: 'utf-8' });
      const gpsLinhas = docGps.split(/\n/);
      const gpsDto: GpsImportDto[] = [];
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
        })
      }
      console.log("fim de leitura gps");
      return gpsDto;
    } catch (err) {
      throw err;
    }
  }

  public async formatDocBilhetagem(file: FileTemp): Promise<BilhetagemDto[]> {
    try {
      console.log("inicio de leitura bilhetagem");
      const doc = fs.readFileSync(file.tempFilePath, { encoding: 'utf8' });
      const documentArray = doc.replace(/["]/g, '').split(/\n/);
      const arrayDocument: BilhetagemDto[] = [];
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

    } catch (error) {
      throw error;
    }
  }

  public dateString2Date(dateString, convert = false) {
    var dt: string[] = dateString?.split(/\-|\s/g);
    let time;
    if (dt.length > 3) {
      time = dt[3];
    } else {
      time = dt[2];
    }
    return new Date(dt.slice(0, 2).join('-') + ' ' + time);
  }


}