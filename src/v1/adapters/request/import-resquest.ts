import { Request } from 'express';

export interface ImportRequest extends Request {
    bilhetagem: File;
    gps:File;
}

export interface GetRelationshipRequest extends Request {
    date?: string;
    carro?: string;
}