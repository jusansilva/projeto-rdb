import { UserBusinessDelegate } from '../../../business/delegate';
import { UserRequest } from 'v1/adapters/request';
import { AuthResponse } from 'v1/adapters/response';
import { Request, Response } from 'express';
import { UserDto } from 'v1/adapters/dtos';
export class UserControlles {
    protected readonly delegate = new UserBusinessDelegate();

    public async create(dto: UserDto, res: Response): Promise<UserDto>{
        try {
            const create = await this.delegate.create(dto);
            res.json(create);
            return create
        } catch (error) {
            
        }
    }
    public async logar(body: UserRequest, res: Response, authorization?: string): Promise<AuthResponse> {
        try {
            const logado = await this.delegate.logar(body, authorization);
            res.json(logado);
            return logado;
        } catch (error) {

        }

    }

}