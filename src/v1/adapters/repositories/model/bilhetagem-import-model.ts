import * as mongoose from "mongoose";

export interface IBilhetagemImportModel extends mongoose.Document {
  carro?: string;
  linha?: string;
  data?: string;
  cartaoId?: string;
  transacao?: string;
  sentido?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = new mongoose.Schema(
  {
    carro: {
      type: String,
    },
    linha: {
      type: String,
    },
    data: {
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
    }
  },
  {
    timestamps: true,
  }
);

const BilhetagemImportModel = mongoose.model<IBilhetagemImportModel>(
  "BilhetagemImportModel",
  Schema,
  "bilhetagem",
  true
);

export { BilhetagemImportModel };