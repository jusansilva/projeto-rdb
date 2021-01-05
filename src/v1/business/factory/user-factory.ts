import Container, { Service } from "typedi";
import { FactoryName } from "../../config/factory";
import { Factory } from "../../adapters/adapter-factory";
import { UserFacade } from "v1/adapters/facade";
import { UserBusiness } from "../logic";


@Service(FactoryName.BusinessUser)
export class UserFactory implements Factory<UserFacade> {
  build(): UserFacade {
    return Container.get(UserBusiness);
  }
}
