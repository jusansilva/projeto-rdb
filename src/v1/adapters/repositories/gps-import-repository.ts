import { IGpsImportModel, GpsImportModel, IBilhetagemImportModel } from "./model";
import { GpsImportDto } from "../dtos/import-dto";

export class GpsImportRepository {

    public async create(dto: GpsImportDto): Promise<IGpsImportModel> {
        try {
            const bilhetagem = await GpsImportModel.create(dto);
            return bilhetagem;
        } catch (error) {
            throw error;
        }
    }

    public async createMany(dto: GpsImportDto[]): Promise<IGpsImportModel[]> {
        try {
            const bilhetagem = await GpsImportModel.insertMany(dto);
            return bilhetagem;
        } catch (error) {
            throw error;
        }
    }

    public async find(data?: string, carro?: string, document?: string, skip: number = 0): Promise<IGpsImportModel[]> {
        try {
            if (data !== undefined && carro !== undefined) {
                return await GpsImportModel.find({ data: data, carro: carro, document: document }).skip(skip);
            }
            if (data !== undefined && carro === undefined) {
                return await GpsImportModel.find({ data: data, document: document });
            }
            if (carro !== undefined && data === undefined) {
                return await GpsImportModel.find({ carro: carro, document: document }).skip(skip);
            }
            return await GpsImportModel.find({ document: document }).skip(skip);

        } catch (err) {
            throw err
        }
    }

    public async findRelacao(bilhetagem: IBilhetagemImportModel, document: string): Promise<IGpsImportModel> {
        const datePlus = new Date(bilhetagem.data);
        datePlus.setTime(datePlus.getTime() + 20000 * 60);
        
        const dateMine = new Date(bilhetagem.data);
        dateMine.setTime(dateMine.getTime() - 20000 * 60);
        return await GpsImportModel.findOne({
            carro: bilhetagem.carro,
            document: document,
            data_final: { $gte: dateMine, $lt: datePlus }
        })

    }
}