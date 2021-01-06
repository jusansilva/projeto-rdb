import { Request } from 'express';
import { FileTemp } from '../dtos';

export interface ImportRequest extends Request {
    bilhetagem: FileTemp;
    gps:FileTemp;
}

export interface GetRelationshipRequest extends Request {
    date?: string;
    carro?: string;
}