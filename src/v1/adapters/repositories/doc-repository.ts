import { IDocModel, DocModel } from "./model";

export class DocRepository {

    public async find(req): Promise<IDocModel[]> {
        try {
            const find = DocModel.find();
            return find;
        } catch (err) {
            
        }
    }
}