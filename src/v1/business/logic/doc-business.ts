import { Container, Service, ContainerInstance } from "typedi";
import * as fs from "fs";
import { ImportDto, BilhetagemDto, GpsImportDto, RelationshipDto } from "../../adapters/dtos/import-dto";
import { BilhetagemImportRepository, GpsImportRepository, RelationshipRepository } from "../../adapters/repositories";
import { IBilhetagemImportModel } from "v1/adapters/repositories/model/bilhetagem-import-model";
import { IRelationshipModel } from "v1/adapters/repositories/model";


@Service()
export class DocBusiness {
  protected readonly bilhetagemRepository: BilhetagemImportRepository;
  protected readonly gpsRepository: GpsImportRepository;
  protected readonly realationshipRepository: RelationshipRepository;
  constructor(container: ContainerInstance) {
    this.bilhetagemRepository = container.get(BilhetagemImportRepository);
    this.gpsRepository = container.get(GpsImportRepository)
    this.realationshipRepository = container.get(RelationshipRepository);
  }

  public async import(dto: ImportDto): Promise<string> {
    try {
      switch (dto.type) {
        case 'bilhetagem':
          const bilhetagem = await this.formatDocBilhetagem(dto.data);
          const createDocument = [];
          for (let i = 0; i < bilhetagem.length; i++) {
            console.log(i);
            createDocument.push(await this.bilhetagemRepository.create({ ...bilhetagem[i], updatedAt: new Date, createdAt: new Date }));
          }
          const documentDto = createDocument.map(create => this.parseDto(create));
          return "documento criado";
        case 'gps':
          const gpsDoc = await this.formatDocGps(dto.data);
          for (let i = 0; i < gpsDoc.length; i++) {
            await this.gpsRepository.create({ ...gpsDoc[i], updatedAt: new Date, createdAt: new Date })
            console.log(i);
          }
          console.log("documento criado totalmente")
          return "documento criado"
        default:
          break;
      }

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

  public async saveRelatioship(date: string, carro: string): Promise<string> {
    try {

      console.log("começou a pesquisa bilhetagem");
      const bilhetagem = await this.bilhetagemRepository.findRelationship(date, carro);
      console.log("bilhetagem concluida");



      for (let a = 0; a < bilhetagem.length; a++) {
        console.log(`rodando ${a} de ${bilhetagem.length}`)
        console.log("gps pesquisando")
        let gps = await this.gpsRepository.find(date, bilhetagem[a].carro);
        console.log("gps finalizado")
        let bDate;
        let gDate;
        for (let i = 0; i < gps.length; i++) {
          if (bilhetagem[a].carro === gps[i].carro) {
            bDate = this.dateString2Date(bilhetagem[a].data.trim().replace("/", "-"));
            gDate = this.dateString2Date(gps[i].data_final.trim().replace("/", "-"));
            if (gDate?.getDate() === bDate?.getDate()) {
              if (bDate.getHours() == gDate.getHours()) {
                if (bDate.getMinutes() > gDate.getMinutes() - 1 && bDate.getMinutes() < gDate.getMinutes() + 1) {
                  console.log(`criou carro: ${bilhetagem[a].carro} com AVL: ${gps[i].AVL}`);
                  await this.realationshipRepository.create(
                    {
                      data_gps: gps[i].data_final,
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
                    })
                }
              }
            }
          }
        }
      }
      console.log('terminou')

      return "dados estao sendo processados";

    } catch (error) {
      console.log(error);
      throw error;
    }
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

  public async formatDocGps(path: string): Promise<GpsImportDto[]> {
    try {
      const docGps = fs.readFileSync(path, { encoding: 'utf-8' });
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
          sentido: gpsArray[9]
        })
      }
      return gpsDto;
    } catch (err) {
      throw err;
    }
  }

  public async formatDocBilhetagem(path: string): Promise<BilhetagemDto[]> {
    try {
      const doc = fs.readFileSync(path, { encoding: 'utf8' });
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