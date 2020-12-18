import { Request } from 'express';

export interface ImportRequest extends Request {
    data: string;
    type: string;
}

export interface GetRelationshipRequest extends Request {
    date?: string;
    carro?: string;
}