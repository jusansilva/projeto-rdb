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
      console.log("Inicio  de criação de bilhetagem");
      const bilhetagem = await this.formatDocBilhetagem(dto.bilhetagem);
      const createDocument = [];
      const saveBilhetagem =  await Promise.all(bilhetagem.map(async (bilhete, i, total) => {
        console.log(`${i} de ${total.length}`);
        return await this.bilhetagemRepository.create({ ...bilhete, updatedAt: new Date, createdAt: new Date });
      }))

      console.log("fim  de criação de bilhetagem");
      console.log("inicio de criação de gps");
      const gpsDoc = await this.formatDocGps(dto.gps);
      const saveGps = await Promise.all(gpsDoc.map(async (gps, i, total) => {
        console.log(`${i} de ${total.length}`);
        return await this.gpsRepository.create({ ...gps, updatedAt: new Date, createdAt: new Date })
      }))

      console.log("fim de criação de gps");

      console.log("iniciando relação");
      await this.saveRelatioship(saveBilhetagem, saveGps, dto.bilhetagem.tempFilePath, dto.gps.tempFilePath);
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
      await this.emailUtils.sendEmail(sendemail)

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
      return gpsDto;
    } catch (err) {
      throw err;
    }
  }

  public async formatDocBilhetagem(file: FileTemp): Promise<BilhetagemDto[]> {
    try {
      console.log(file);
      const doc = fs.readFileSync(file.tempFilePath, { encoding: 'utf8' });
      console.log(doc)
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