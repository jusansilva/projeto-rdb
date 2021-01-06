import { Request } from 'express';

export interface UserRequest extends Request {
    email?: string;
    password?: string;
    token?: string;
}

export interface CreateUserRequest extends Request {
    body: {
        nome: string,
        email: string,
        password: string,
    }
}
