import { UserBusinessDelegate } from '../../../business/delegate';
import { UserRequest } from 'v1/adapters/request';
import { AuthResponse } from 'v1/adapters/response';
import { Request, Response } from 'express';
import { UserDto } from 'v1/adapters/dtos';
export class UserControlles {
    protected readonly delegate = new UserBusinessDelegate();

    public async logar(body: UserRequest, res: Response): Promise<AuthResponse> {
        try {
            const logado = await this.delegate.logar(body);
            res.json(logado);
            return logado;
        } catch (error) {

        }

    }

}