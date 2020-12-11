import { Container, Service, ContainerInstance } from "typedi";
import * as fs from "fs";
import { ImportDto, BilhetagemDto } from "../../adapters/dtos/import-dto";
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
      const document = await this.formatDoc(dto.data);
      const createDocument : IBilhetagemImportModel[] = [];
      for(let i = 0; i < document.length; i++) {
        console.log(i);
        createDocument.push(await this.bilhetagemRepository.create({...document[i],updatedAt: new Date, createdAt: new Date }))
      }
      const documentDto = createDocument.map(create =>  this.parseDto(create))
      console.log(documentDto.length);
      return documentDto[documentDto.length];
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


  public async formatDoc(path: string): Promise<BilhetagemDto[]> {
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