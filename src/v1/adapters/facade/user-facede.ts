import { UserDto } from "../dtos";
import { AuthResponse } from "v1/adapters/response";

export interface UserFacade {
    logar: (dto: UserDto) => Promise<AuthResponse>;
}
