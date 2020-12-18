import * as mongoose from "mongoose";

export interface ICarrosModel extends mongoose.Document {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = new mongoose.Schema(
  {
    carro: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const CarrosModel = mongoose.model<ICarrosModel>(
  "CarrosModel",
  Schema,
  "carros",
  true
);

export { CarrosModel };