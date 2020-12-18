import * as mongoose from "mongoose";

export interface ISbegpsModel extends mongoose.Document {
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
    cod_linha_sbe: {
      type: String,
      required: true,
    },
    data: {
        type:Date,
        required: true,
    },
    hora_cartao: {
      type: String,
      required: true,
    },
    id_cartao: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    latitude2: {
      type: String,
      required: true,
    },
    linha: {
      type: String,
    },
    linha_sbe: {
      type: String,
    },
    logintude: {
        type: String,
    },
    logintude2: {
        type: String,
    },
    sentido:{
        type: String,
    },
    tamanho:{
        type: String,
    },
    tipo_cartao:{
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

const SbegpsModel = mongoose.model<ISbegpsModel>(
  "SbegpsModel",
  Schema,
  "sbegps",
  true
);

export { SbegpsModel };