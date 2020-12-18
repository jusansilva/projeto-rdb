import * as mongoose from "mongoose";

export interface ICartaoModel extends mongoose.Document {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = new mongoose.Schema(
  {
    tipo_cartao: {
      type: String,
      required: true,
    },
    valor: {
        type:String,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const CartaoModel = mongoose.model<ICartaoModel>(
  "CartaoModel",
  Schema,
  "cartao",
  true
);

export { CartaoModel };