import * as mongoose from "mongoose";

export interface IGpsImportModel extends mongoose.Document {
  carro?: string;
  linha?: string;
  data_final?: string;
  AVL?: string;
  cartaoId?: string;
  transacao?: string;
  latitude?: string;
  longitude?: string;
  sentido?: string;
  ponto_notavel?: string;
  desc_ponto_notavel?: string;
  document?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = new mongoose.Schema(
  {
    data_final: {
      type: String,
    },
    AVL: {
      type: String,
    },
    carro: {
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
    },
    linha: {
      type: String,
    },
    sentido: {
      type: String,
    },
    document: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const GpsImportModel = mongoose.model<IGpsImportModel>(
  "GpsImportModel",
  Schema,
  "gps",
  true
);

export { GpsImportModel };