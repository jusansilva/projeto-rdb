import * as mongoose from "mongoose";

export interface ISbeModel extends mongoose.Document {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = new mongoose.Schema(
  {
    carro: {
      type: String,
      required: true,
    },
    data: {
        type:Date,
        required: true,
    },
    faixa_horaria: {
      type: String,
      required: true,
    },
    hora_transacao: {
      type: String,
      required: true,
    },
    id_linha_sbe: {
      type: String,
      required: true,
    },
    id_cartao: {
      type: String,
      required: true,
    },
    linha_sbe: {
      type: String,
    },
    sentido: {
        type: String,
    },
    tipo_cartao: {
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

const SbeModel = mongoose.model<ISbeModel>(
  "SbeModel",
  Schema,
  "sbe",
  true
);

export { SbeModel };