import { DocsBusinessDelegate } from '../../../business/delegate';
import { ImportRequest } from 'v1/adapters/request/import-resquest';
import { Request, Response } from 'express';
import { BilhetagemDto } from 'v1/adapters/dtos/import-dto';
export class DocsControlles {
      protected readonly delegate = new DocsBusinessDelegate();

      public async importData(req: ImportRequest, res: Response): Promise<BilhetagemDto> {
            try {
                  const imp = await this.delegate.import(req);
                  res.json(imp);
                  return imp;
            } catch (err) {
                  console.log(err);
                  throw err;
            }
      }
}