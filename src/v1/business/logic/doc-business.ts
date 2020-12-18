import { Container, Service, ContainerInstance } from "typedi";
import * as fs from "fs";
import { ImportDto, BilhetagemDto, GpsImportDto, RelationshipDto } from "../../adapters/dtos/import-dto";
import { BilhetagemImportRepository, GpsImportRepository } from "../../adapters/repositories";
import { IBilhetagemImportModel } from "v1/adapters/repositories/model/bilhetagem-import-model";
import { IGpsImportModel, GpsImportModel } from "v1/adapters/repositories/model";


@Service()
export class DocBusiness {
  protected readonly bilhetagemRepository: BilhetagemImportRepository;
  protected readonly gpsRepository: GpsImportRepository;
  constructor(container: ContainerInstance) {
    this.bilhetagemRepository = container.get(BilhetagemImportRepository);
    this.gpsRepository = container.get(GpsImportRepository)
  }

  public async import(dto: ImportDto): Promise<string> {

    try {


    } catch (err) {
      console.log(err)
      throw err;
    }
  }


  public async find(date?: string, carro?: string): Promise<RelationshipDto[]> {
    try {
      console.log(date, carro, "começou a pesquisa");
      const bilhetagem = await this.bilhetagemRepository.find(date, carro);
      console.log(bilhetagem);
      const gps = await this.gpsRepository.find(date, carro);
      console.log(gps);
      console.log("terminou a pesquisa");
      const relationship: RelationshipDto[] = bilhetagem.map(bilhetagem => {
        for (let i = 0; i < gps.length; i++) {
          if (bilhetagem.carro === gps[i].carro && bilhetagem.linha === gps[i].linha) {
            let bDate = this.dateString2Date(bilhetagem.data.replace("/", "-"));
            let gDate = this.dateString2Date(gps[i].data.replace("/", "-"));
            if (gDate.getDate() === bDate.getDate()) {
              if (bDate.getHours() == gDate.getHours()) {
                if (bDate.getMinutes() > gDate.getMinutes() - 1 && bDate.getMinutes() < gDate.getMinutes() + 1) {
                  console.log({
                    data_gps: gps[i].data,
                    linha: bilhetagem.linha,
                    AVL: gps[i].AVL,
                    cartaoId: bilhetagem.cartaoId,
                    transacao: bilhetagem.transacao,
                    sentido: bilhetagem.sentido,
                    latitude: gps[i].latitude,
                    longitude: gps[i].longitude,
                    ponto_notavel: gps[i].ponto_notavel,
                    desc_ponto_notavel: gps[i].desc_ponto_notavel
                  });
                  return {
                    data_gps: gps[i].data,
                    linha: bilhetagem.linha,
                    AVL: gps[i].AVL,
                    cartaoId: bilhetagem.cartaoId,
                    transacao: bilhetagem.transacao,
                    sentido: bilhetagem.sentido,
                    latitude: gps[i].latitude,
                    longitude: gps[i].longitude,
                    ponto_notavel: gps[i].ponto_notavel,
                    desc_ponto_notavel: gps[i].desc_ponto_notavel
                  }
                }
              }
            }
          }
        }
      })

      return relationship;
    } catch (error) {

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

  public dateString2Date(dateString) {
    var dt = dateString.split(/\-|\s/);
    return new Date(dt.slice(0, 3).join('-') + ' ' + dt[3]);
  }


}