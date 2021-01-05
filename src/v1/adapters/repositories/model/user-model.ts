import * as mongoose from "mongoose";

export interface IUserModel extends mongoose.Document {
  nome: string;
  email: string;
  password: string;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
        type:String,
        required: true,
    },
    token: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUserModel>(
  "UserModel",
  Schema,
  "user",
  true
);

export { UserModel };