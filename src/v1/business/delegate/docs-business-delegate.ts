import { DocsFacade } from "../facade";
import { Inject } from "typedi";
import { FactoryName } from "../../../config/factory";
import { DocsFactory } from "../../../adapters/factory";
import { Request } from "express";

export class DocsBusinessDelegate implements DocsFacade {
  @Inject(FactoryName.BusinessSuportDanone)
  private readonly factory = new DocsFactory();

  async import(file: Request): Promise<DocsImportResponse> {
    return this.factory.build().import(file);
  }
}
