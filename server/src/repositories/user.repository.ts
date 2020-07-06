import MongooseRepository from "./repository";
import Model, { UserDocument, UserModel } from "../models/user.model";
import ClientsDevelopersModel from "../models/clientsDevelopers.model";

/**
 * Users repository
 */
class UsersRepository extends MongooseRepository<UserDocument, UserModel> {
  /**
   * Constructor
   */
  constructor() {
    super(Model);
    this.fieldsSearch = ["name", "email", "surname", "username"];
    this.queryFields = "-password";
  }

  /**
   * Find user's clients.
   * @param {string} id - User Id
   * @param {number} pageNum - amount of records to skip
   * @param {number} pageSize - amount of records to return
   */

  async findUserClients(
    id: string,
    pageNum: number,
    pageSize: number,
    search: string,
    query = { active: true }
  ) {
    this.queryFields = "-";
    const myfieldsSearch = ["name", "email", "contactName"];
    const options = {};
    super.paginationQueryOptions(pageNum, pageSize, options);
    if (search) super.searchQueryOptions(search, myfieldsSearch, query);

    /**
     *   [{$lookup:{
        from:'position',
        localField:'_id',
        foreignField: 'user',
        as: 'positions' }
    }, {
        $match:{
        'positions.client': ObjectId("5e93cf708e754c961cafab49")
       }
   }
     */

    const clients: any = await ClientsDevelopersModel.find(
      { employee: id },
      "client"
    )
      .populate({ path: "clients", options: options, match: query })
      .lean()
      .exec();

    const count: any = await ClientsDevelopersModel.find(
      { employee: id },
      "client"
    )
      .lean()
      .exec();

    return {
      list: clients.clients || [],
      count: count.clients.length,
    };
  }

  /**
   * Find user by username.
   */
  findOneByName(username: string) {
    return this.model
      .findOne({ username: username }, this.queryFields)
      .lean()
      .exec();
  }

  /**
   * Find user by username or email.
   * used to login
   */
  findOneToLogin(email: string) {
    return this.model
      .findOne({ $or: [{ email: email }, { username: email }] })
      .populate({ path: "roles", select: "name" })
      .exec();
  }

  /**
   * Reset user password.
   */
  resetExpires(email: string, token: string, dateExpire: Date) {
    return this.model
      .findOneAndUpdate(
        { email: email },
        { reset_password_token: token, reset_password_expires: dateExpire }
      )
      .exec();
  }

  /**
   * Find an user with his clients.
   * @param {string} id - Object Id
   */
  findOne(id: string) {
    return this.model
      .findOne(
        {
          _id: id,
        },
        this.queryFields
      )
      .populate("clients", "-employees")
      .populate("roles")
      .lean()
      .exec();
  }
}

export default UsersRepository;
