import {IUserModel, UserModel } from "./model/";
import { UserDto} from "../dtos";

export class UserRepository {
    
    public async logar(email: string, password: string): Promise<IUserModel>{
        try {
            const find = await UserModel.findOne({email: email, password: password});
            return find;
        } catch (error) {
            console.log(error);
            return error
        }
    }

    public async updateToken(token: string, email: string): Promise<IUserModel> {
        try {
            const updated = await UserModel.update({email: email}, {token: token});
            return updated;
        } catch (error) {
            
        }
    }
}