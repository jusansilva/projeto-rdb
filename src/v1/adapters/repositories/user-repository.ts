import { IUserModel, UserModel } from "./model/";
import { UserDto } from "../dtos";

export class UserRepository {

    public async logar(email: string, password: string): Promise<IUserModel> {
        try {
            const find = await UserModel.findOne({ email: email, password: password });
            return find;
        } catch (error) {
            console.log(error);
            return error
        }
    }

    public async updateToken(token: string, email: string): Promise<IUserModel> {
        try {
            const updated = await UserModel.updateOne({ email: email }, { token: token });
            return updated;
        } catch (error) {
            console.log(error);
            return error
        }
    }

    public async create(dto: UserDto): Promise<IUserModel> {
        try {
            const model = await UserModel.create({nome: dto.nome, email:dto.email, password: dto.password, token:dto.token});
            return model;
        } catch (error) {
            console.log(error);
            return error
        }
    }
}