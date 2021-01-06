import { IBilhetagemImportModel, BilhetagemImportModel, GpsImportModel } from "./model";
import { BilhetagemDto } from "../dtos/import-dto";

export class BilhetagemImportRepository {

    public async create(dto: BilhetagemDto): Promise<IBilhetagemImportModel> {
        try {
            const bilhetagem = BilhetagemImportModel.create(dto);
            return bilhetagem;
        } catch (error) {
            throw error;
        }
    }

    public async find(data?: string, carro?: string): Promise<IBilhetagemImportModel[]> {
        try {
            if (data !== undefined && carro !== undefined) {
                return BilhetagemImportModel.find({ "data": data, "carro": carro });
            }
            if (data !== undefined && carro === undefined) {
                return BilhetagemImportModel.find({ "data": data });
            }
            if (carro !== undefined && data === undefined) {
                return BilhetagemImportModel.find({ "carro": carro });
            }
            return BilhetagemImportModel.find();

        } catch (err) {
            throw err
        }
    }

    public async findRelationship(date?: string, carro?: string, document?: string): Promise<any[]> {
        try {
            const gpsModel = GpsImportModel
            console.log(document)
            console.log(date, carro);
            if (date !== undefined && carro !== undefined) {
                return BilhetagemImportModel.aggregate([
                    {
                        "date": date, "carro": carro, document: document
                    },
                    {
                        $lookup: {
                            from: gpsModel.collection.carro,
                            localField: 'carro',
                            foreignField: 'carro',
                            as: 'relatioship'
                        }
                    }]);
            }
            if (date !== undefined) {
                return BilhetagemImportModel.find({ "data": date, document: document });
            }
            if (carro !== undefined) {
                return BilhetagemImportModel.find({ "carro": carro, document: document });
            }
            const bilhetagem = BilhetagemImportModel.find({ document: document });
            console.log(bilhetagem);
            return bilhetagem 


        } catch (err) {

        }
    }
}