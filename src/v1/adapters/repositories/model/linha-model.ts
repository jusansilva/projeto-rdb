import * as mongoose from "mongoose";

export interface ILinhaModel extends mongoose.Document {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = new mongoose.Schema(
  {
    area: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      required: true,
    },
    empresa: {
        type:String,
        required: true,
    },
    empresa_1: {
      type: String,
      required: true,
    },
    id_linha_sbe: {
      type: String,
      required: true,
    },
    linha: {
      type: String,
      required: true,
    },
    lote: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const LinhaModel = mongoose.model<ILinhaModel>(
  "LinhaModel",
  Schema,
  "linha",
  true
);

export { LinhaModel };