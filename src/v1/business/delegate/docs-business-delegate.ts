import { Inject } from "typedi";
import { FactoryName } from "../../config/factory";
import { DocsFactory } from "../factory";
import { DocsFacade } from "../../adapters/facade";
import { ImportDto, RelationshipDto } from "v1/adapters/dtos/import-dto";

export class DocsBusinessDelegate implements DocsFacade {
  @Inject(FactoryName.BusinessDoc)
  private readonly factory = new DocsFactory();

  async import(dto: ImportDto): Promise<void> {
    return this.factory.build().import(dto);
  }

  async find(date?: string, carro?:string): Promise<RelationshipDto[]>{
    return this.factory.build().find(date, carro);
  }

  async saveRelatioship(date?: string, carro?: string):Promise<string>{
    return this.factory.build().saveRelatioship(date, carro);
  }
}
