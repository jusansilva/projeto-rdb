import * as mongoose from "mongoose";

export interface IDocModel extends mongoose.Document {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = new mongoose.Schema(
  {
    speciality: {
      type: Object,
      required: true,
    },
    holder: {
      type: String,
      required: true,
    },
    schedules: [String],
    scheduled_to: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    requester: {
      type: Object,
      required: true,
    },
    supporter: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const DocModel = mongoose.model<IDocModel>(
  "DocModel",
  Schema,
  "Doc",
  true
);

export { DocModel };