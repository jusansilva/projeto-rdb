import Container, { Service } from "typedi";
import { FactoryName } from "../../config/factory";
import { Factory } from "../../adapters/adapter-factory";
import { DocsFacade } from "v1/adapters/facade";
import { DocBusiness } from "../logic";


@Service(FactoryName.BusinessDoc)
export class DocsFactory implements Factory<DocsFacade> {
  build(): DocsFacade {
    return Container.get(DocBusiness);
  }
}
