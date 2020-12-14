import { Container, Service, ContainerInstance } from "typedi";
import * as fs from "fs";
import { ImportDto, BilhetagemDto, GpsImportDto } from "../../adapters/dtos/import-dto";
import { BilhetagemImportRepository } from "../../adapters/repositories";
import { IBilhetagemImportModel } from "v1/adapters/repositories/model/bilhetagem-import-model";


@Service()
export class DocBusiness {
  protected readonly bilhetagemRepository: BilhetagemImportRepository;
  constructor(container: ContainerInstance) {
    this.bilhetagemRepository = container.get(BilhetagemImportRepository);
  }

  public async import(dto: ImportDto): Promise<BilhetagemDto> {
    try {
      switch (dto.type) {
        case 'bilhetagem':
          const bilhetagem = await this.formatDocBilhetagem(dto.data);
          const createDocument: IBilhetagemImportModel[] = [];
          for (let i = 0; i < bilhetagem.length; i++) {
            console.log(i);
            createDocument.push(await this.bilhetagemRepository.create({ ...bilhetagem[i], updatedAt: new Date, createdAt: new Date }))
          }
          const documentDto = createDocument.map(create => this.parseDto(create))
          return documentDto[documentDto.length];
        case 'gps':
          const gpsDoc = await this.formatDocGps(dto.data);

        default:
          break;
      }


    } catch (err) {
      console.log(err)
      throw err;
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
      for (let i = 0; i > gpsLinhas.length; j++) {
        const gpsArray = docGps[i].split("\t");
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


}