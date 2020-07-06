import mongoose, { Schema, Document } from "mongoose";
import Joi from "@hapi/joi";
import type { ClientDocument } from "./client.model";
import type { UserDocument } from "./user.model";

export interface IClientDeveloper extends Document {
  rate: number;
  start: Date;
  end?: Date;
  employee: UserDocument["_id"];
  client: ClientDocument["_id"];
}

const clientsDevelopersModel: Schema = new Schema({
  rate: Number,
  start: Date,
  end: {
    type: Date,
    default: undefined,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientModel",
    required: true,
  },
});

const clientDevValidation = Joi.object().keys({
  // id: Joi.string(),
  // _id: Joi.string(),
  // __v: Joi.any(),
  // start: Joi.date().max(Joi.ref("end")),
  // end: Joi.date().min(Joi.ref("start")),
  // rate: Joi.number().min(0),
});

/**
 * Indexes
 */
clientsDevelopersModel.index({ client: 1 });
clientsDevelopersModel.index({ employee: 1 });

/**
 * Validation methods
 */
clientsDevelopersModel.statics.validateCreate = (data: any) => {
  return clientDevValidation.validate(data, { abortEarly: false });
};
clientsDevelopersModel.statics.validateUpdate = (data: any) => {
  return clientDevValidation.validate(data, { abortEarly: false });
};

export default mongoose.model<IClientDeveloper>(
  "ClientsDevelopersModel",
  clientsDevelopersModel
);
