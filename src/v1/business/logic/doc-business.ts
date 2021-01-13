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
      const bilhetagemSave = await Promise.all(await this.getBilhetagem(dto.bilhetagem));
      console.log("Fim de Bilhetagem")
      console.log("Inicio de Gps")
      await Promise.all(await this.getGps(dto.gps));
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

    } catch (err) {
      console.log(err)
      throw err;
    }

  }

  public async getBilhetagem(bilhetagemFile: FileTemp): Promise<IBilhetagemImportModel[]> {
    try {
      let bilhetagemSave: BilhetagemDto[] = []
      const bilhetagemRetorno: IBilhetagemImportModel[] = [];
      let i = 0;
      return new Promise((resolve, rejects) =>{
        lineReader.eachLine(bilhetagemFile.tempFilePath, async (line, last) => {
        let forReplace = line.replace(/[""]/g, "");
        let dados = forReplace.split(',');
        i++;
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
          bilhetagemSave.push(bilhetagem);
        }

        if (last) {
          const retorno = await this.bilhetagemRepository.createMany(bilhetagemSave);
          await retorno.map(bilhetagem => {
            bilhetagemRetorno.push(bilhetagem);
          })
          while(bilhetagemSave.length) {
            bilhetagemSave.pop();
          }
          console.log(`${i} Bilhetagem foram salvos`)
          return bilhetagemRetorno;
        }

        if (bilhetagemSave.length > 20) {
          await this.bilhetagemRepository.createMany(bilhetagemSave)
          while(bilhetagemSave.length) {
            bilhetagemSave.pop();
          }
        }

      });

      resolve(bilhetagemRetorno);
    })

    } catch (error) {
      console.log(error)
      throw error
    }
  }


  public async getGps(gpsFile: FileTemp): Promise<any> {
    try {

      const gpsSave: IGpsImportModel[] = [];
      let gpstransfer: GpsImportDto[] = [];
      const fileStream = fs.createReadStream(gpsFile.tempFilePath);

      let i = 0;
     return new Promise((resolve, rejects) =>{
        lineReader.eachLine(gpsFile.tempFilePath, async (line, last) => {

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
          document: gpsFile.tempFilePath,
          updatedAt: new Date,
          createdAt: new Date
        });

        if(last){
          let save = await this.gpsRepository.createMany(gpstransfer);
          resolve(save.map(gps => {
            gpsSave.push(gps)
          })) 
          while(gpstransfer.length) {
            gpstransfer.pop();
          }
          console.log(gpstransfer);
          console.log(`${i} gps salvos`)
          return false;

        }

        if(gpstransfer.length > 20){
          let save = await this.gpsRepository.createMany(gpstransfer);
          save.map(gps => {
            gpsSave.push(gps)
          }) 
          while(gpstransfer.length) {
            gpstransfer.pop();
          }
        }    
      });
    })
  } catch(error) {
    console.log(error)
    throw error
  }

}

  public async find(date ?: string, carro ?: string): Promise < RelationshipDto[] > {
  try {
    const relationship = await this.realationshipRepository.find(date, carro);
    return relationship;
  } catch(error) {
    console.log(error)
    throw error
  }
}


  public parseEmailDto(text: string, subject: string, filename: string, path ?: any): EmailDto {
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

  public async getAttachments(name: string): Promise < string > {
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