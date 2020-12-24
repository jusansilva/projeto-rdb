import * as mongoose from "mongoose";

export interface IRelationshipModel extends mongoose.Document {
    data_gps: string;
    carro?: string;
    linha: string;
    AVL: string;
    cartaoId?: string;
    transacao?: string;
    sentido?: string;
    latitude: string;
    longitude: string;
    ponto_notavel: string;
    desc_ponto_notavel: string;
}

const Schema = new mongoose.Schema(
    {
        data_gps: {
            type: String,
        },
        carro: {
            type: String,
        },
        linha: {
            type: String,
        },
        AVL: {
            type: String,
        },
        cartaoId: {
            type: String,
        },
        transacao: {
            type: String,
        },
        sentido: {
            type: String,
        },
        latitude: {
            type: String,
        },
        longitude: {
            type: String,
        },
        ponto_notavel: {
            type: String,
        },
        desc_ponto_notavel: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const RelationshipModel = mongoose.model<IRelationshipModel>(
    "RelationshipModel",
    Schema,
    "relationship",
    true
);

export { RelationshipModel };