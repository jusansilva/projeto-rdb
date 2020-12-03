import { GenericFactory } from "../adapter-factory";
import { DocsFacade } from "../../business/facade";
import Container, { Service } from "typedi";
import { FactoryName } from "../../config/factory";
import { DocBusiness } from "../../business/logic";
import { DocRepository } from "../repositories";
import { DocsBusinessDelegate } from "../../business/delegate";


@Service(FactoryName.BusinessDoc)
export class DocsFactory implements GenericFactory<DocsFacade> {
  build(): DocsFacade {
    return new DocBusiness(
      Container.get(DocRepository),
      new DocsBusinessDelegate()
    );
  }
}
