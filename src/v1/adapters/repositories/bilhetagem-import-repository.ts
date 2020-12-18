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

    public async find(data?: string, carro?: string ): Promise<IBilhetagemImportModel[]> {
        try {
            if(data !== undefined && carro !== undefined){
                return BilhetagemImportModel.find({"data": data, "carro":carro});
            }
            if(data !== undefined ){
                return BilhetagemImportModel.find({"data": data});
            }
            if(carro !== undefined){
                return BilhetagemImportModel.find({"carro":carro});
            }
            return BilhetagemImportModel.find({});

        } catch (err) {
            throw err
        }
    }
}