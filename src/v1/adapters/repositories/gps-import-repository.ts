import { IGpsImportModel, GpsImportModel } from "./model";
import { GpsImportDto } from "../dtos/import-dto";

export class GpsImportRepository {
    
    public async create(dto: GpsImportDto ): Promise<IGpsImportModel> {
        try {
            const bilhetagem = GpsImportModel.create(dto);
            return bilhetagem;
        } catch (error) {
            throw error;
        }
    }

    public async find(data?: string, carro?: string ): Promise<IGpsImportModel[]> {
        try {
            if(data !== undefined && carro !== undefined){
                return GpsImportModel.find({"data": data, "carro":carro});
            }
            if(data !== undefined){
                return GpsImportModel.find({"data": data});
            }
            if(carro !== undefined){
                return GpsImportModel.find({"carro":carro});
            }
            return GpsImportModel.find({});

        } catch (err) {
            throw err
        }
    }
}