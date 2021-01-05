import { Inject } from "typedi";
import { FactoryName } from "../../config/factory";
import { UserFactory } from "../factory";
import { UserFacade } from "../../adapters/facade";
import { UserDto } from "v1/adapters/dtos";
import { AuthResponse } from "v1/adapters/response"

export class UserBusinessDelegate implements UserFacade {
    @Inject(FactoryName.BusinessDoc)
    private readonly factory = new UserFactory();

    async logar(dto: UserDto): Promise<AuthResponse> {
        return this.factory.build().logar(dto);
    }
}
