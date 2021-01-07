import { UserDto } from "../dtos";
import { AuthResponse } from "v1/adapters/response";

export interface UserFacade {
    logar: (dto: UserDto, authorization?: string) => Promise<AuthResponse>;

    create: (dto: UserDto) => Promise<UserDto>;

    auth: (auth: string) => Promise<AuthResponse>;
}
