import { Service, Inject } from "typedi";
import { DocRepository } from "v1/adapters/repositories/doc-repository";



@Service()
export class DocBusiness {
  constructor(
    @Inject() protected readonly repository: DocRepository,
  ) { }



}