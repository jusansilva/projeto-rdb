import * as mongoose from "mongoose";

export interface IFaixaHorarioModel extends mongoose.Document {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = new mongoose.Schema(
  {
    faixa_horario: {
      type: String,
      required: true,
    },
    faixa_num: {
        type:Number,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const FaixaHorarioModel = mongoose.model<IFaixaHorarioModel>(
  "FaixaHorarioModel",
  Schema,
  "faixa_horario",
  true
);

export { FaixaHorarioModel };