import { GenericFactory } from "../adapter-factory";
import { DocsFacade } from "../../business/facade";
import Container, { Service } from "typedi";
import { FactoryName } from "../../config/factory";
import { DocsBusiness } from "../../../business/logic/appointment-business";
import { DocsRepository } from "../repositories";
import { DocsBusinessDelegate } from "../../../business/delegate";


@Service(FactoryName.BusinessSuportDanone)
export class DocsFactory implements GenericFactory<DocsFacade> {
  build(): DocsFacade {
    return new DocsBusiness(
      Container.get(DocsRepository),
      new DocsBusinessDelegate()
    );
  }
}
