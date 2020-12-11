import { IBilhetagemImportModel, BilhetagemImportModel } from "./model/bilhetagem-import-model";
import { BilhetagemDto } from "../dtos/import-dto";

export class BilhetagemImportRepository {
    
    public async create(dto: BilhetagemDto ): Promise<IBilhetagemImportModel> {
        try {
            const bilhetagem = BilhetagemImportModel.create(dto);
            return bilhetagem;
        } catch (error) {
            throw error;
        }
    }
}