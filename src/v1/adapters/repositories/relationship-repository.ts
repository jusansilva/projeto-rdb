import { IRelationshipModel, RelationshipModel } from "./model/";
import { BilhetagemDto, RelationshipDto } from "../dtos/import-dto";

export class RelationshipRepository {

    public async create(dto: RelationshipDto): Promise<IRelationshipModel> {
        try {
            const relationship = await RelationshipModel.create(dto);
            return relationship;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async createMany(dto: RelationshipDto[]): Promise<IRelationshipModel[]> {
        try {
            const relationship = await RelationshipModel.insertMany(dto);
            return relationship;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async find(data?: string, carro?: string): Promise<IRelationshipModel[]> {
        try {
            if (data !== undefined && carro !== undefined) {
                return await RelationshipModel.find({ "data": data, "carro": carro });
            }
            if (data !== undefined) {
                return await RelationshipModel.find({ "data": data });
            }
            if (carro !== undefined) {
                return await RelationshipModel.find({ "carro": carro });
            }
            return await RelationshipModel.find({});

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    public async drop(): Promise<any> {
        try {
            const drop = await RelationshipModel.deleteMany();
            return drop;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}