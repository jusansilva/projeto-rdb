import { DocsBusinessDelegate } from '../../../business/delegate';
import { ImportRequest, GetRelationshipRequest } from 'v1/adapters/request/import-resquest';
import { Request, Response } from 'express';
import { RelationshipDto } from 'v1/adapters/dtos/import-dto';
export class DocsControlles {
      protected readonly delegate = new DocsBusinessDelegate();

      public async importData(req: ImportRequest, res: Response): Promise<string> {
            try {
                  const imp = await this.delegate.import(req);
                  res.json(imp);
                  return imp;
            } catch (err) {
                  console.log(err);
                  throw err;
            }
      }

      public async getRelatioship(req: GetRelationshipRequest, res: Response): Promise<RelationshipDto[]> {
            try {
                  const {date, carro} = req;
                  const find = await this.delegate.find(date, carro);
                  res.json(find);
                  return find;
            } catch (err) {
                  console.log(err)
                  throw err;
            }
      }

      public async saveRelatioship(req: GetRelationshipRequest, res: Response): Promise<string> {
            try {
                  const {date, carro} = req;
                  const save = await this.delegate.saveRelatioship(date, carro);
                  res.json(save);
                  return save;
            } catch (err) {
                  console.log(err);
                  throw err;
            }
      }


}