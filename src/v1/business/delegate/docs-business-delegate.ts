import { Inject } from "typedi";
import { FactoryName } from "../../config/factory";
import { Request } from "express";
import { DocsFactory } from "../factory";
import { DocsFacade } from "../../adapters/facade";
import { ImportDto, BilhetagemDto } from "v1/adapters/dtos/import-dto";

export class DocsBusinessDelegate implements DocsFacade {
  @Inject(FactoryName.BusinessDoc)
  private readonly factory = new DocsFactory();

  async import(dto: ImportDto): Promise<BilhetagemDto> {
    return this.factory.build().import(dto);
  }
}
