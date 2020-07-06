import WorkedHoursModel from "../models/workedHours.model";
import { Model, Document } from "mongoose";

/**
 * Worked hours repository
 */
class WorkedHoursRepository {
  model: Model<Document>;

  constructor() {
    this.model = WorkedHoursModel;
  }

  /**
   * Get the worked hours of a user in a given month
   * @param {string} userId user's id
   * @param {string} clientId client's id
   * @param {number} month
   * @param {number} year
   */
  async getUserMonthHours(
    userId: string,
    clientId: string,
    month: number,
    year: number
  ) {
    const start = new Date().setFullYear(year, month, 0);
    const res = await this.model
      .find({
        userId: userId,
        clientId: clientId,
        day: { $lte: start, $gte: new Date(`${year}-${month}-01`) },
      })
      .exec();
    return res;
  }

  /**
   * Set the worked hours
   * @param {string} userId user's id
   * @param {string} clientId client's id
   * @param {*} day date
   * @param {*} hours worked hours
   */
  set(userId: string, clientId: string, day: number, hours: number) {
    const filter = { userId, clientId, day };

    // upsert
    return this.model.findOneAndUpdate(
      filter,
      { hours },
      {
        new: true,
        upsert: true,
      }
    );
  }
}

export default WorkedHoursRepository;
