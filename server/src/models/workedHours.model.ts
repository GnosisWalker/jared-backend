import mongoose, { Schema } from "mongoose";
import Joi from "@hapi/joi";

const workedHoursModel = new Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "ClientModel" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  day: Date,
  hours: String,
});

const workedHoursValidation = Joi.object().keys({
  id: Joi.string(),
  _id: Joi.string(),
  __v: Joi.any(),
  clientId: Joi.string().required(),
  userId: Joi.string().required(),
  day: Joi.date().default("now").required(),
  hours: Joi.number().min(0).max(24).required(),
});

/**
 * indexes
 */
workedHoursModel.index({ userId: 1, clientId: 1, day: 1 }, { unique: true });

/**
 * validation methods
 */
workedHoursModel.statics.validateCreate = (data: any) => {
  return workedHoursValidation.validate(data, { abortEarly: false });
};
workedHoursModel.statics.validateUpdate = (data: any) => {
  return workedHoursValidation.validate(data, { abortEarly: false });
};

export default mongoose.model("WorkedHoursModel", workedHoursModel);
