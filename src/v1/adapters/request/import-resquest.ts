import { Request } from 'express';

export interface ImportRequest extends Request {
    data: string;
    type: string;
}