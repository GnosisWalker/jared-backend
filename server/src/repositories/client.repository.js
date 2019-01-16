const MongooseRepository = require('./repository');
const ClientModel = require('../models/client.model');

class ClientsRepository extends MongooseRepository {
  constructor() {
    super(ClientModel);
  }

  /**
   * Finds all instances in the model.
   * @param {number} pageNum - amount of records to skip
   * @param {number} pageSize - amount of records to return
   */
  findAll(pageNum, pageSize) {
    const query = super.paginationQueryOptions(pageNum, pageSize);
    return super.findAll('-password', query);
  }

  /**
   * Find client by name.
   */
  findOneByName(name) {
    return this.model.findOne({ name: name }).lean().exec();
  }

  /**
   * Find an client with his employees.
   * @param {string} id - Object Id
   */
  findOne(id) {    
    return this.model.findOne({
      _id: id
    }).populate('employees').lean().exec();
  }

}

module.exports = ClientsRepository;