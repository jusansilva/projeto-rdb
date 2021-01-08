import { IGpsImportModel, GpsImportModel } from "./model";
import { GpsImportDto } from "../dtos/import-dto";

export class GpsImportRepository {
    
    public async create(dto: GpsImportDto ): Promise<IGpsImportModel> {
        try {
            const bilhetagem = await GpsImportModel.create(dto);
            return bilhetagem;
        } catch (error) {
            throw error;
        }
    }

    public async find(data?: string, carro?: string,document?: string, skip: number = 0): Promise<IGpsImportModel[]> {
        try {
            if(data !== undefined && carro !== undefined){
                return await GpsImportModel.find({data: data, carro:carro, document: document }).skip(skip);
            }
            if(data !== undefined && carro === undefined){
                return await GpsImportModel.find({data: data, document: document });
            }
            if(carro !== undefined && data === undefined){
                return await  GpsImportModel.find({carro:carro, document: document }).skip(skip);
            }
            return await GpsImportModel.find({document: document }).skip(skip);

        } catch (err) {
            throw err
        }
    }
}