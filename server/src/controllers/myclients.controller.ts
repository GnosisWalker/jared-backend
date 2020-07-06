import CrudRestController from "./crud-rest.controller";
import UserRepository from "../repositories/user.repository";

class MyClientsController extends CrudRestController {
  /**
   * Constructor
   * @param {string} basePath
   * @param {parentRouter} parentRouter
   */
  constructor(...args) {
    super(...args);
    this.setRepository(new UserRepository());
  }

  registerRoutes() {
    this.router.get(
      "/page/:pageNum/size/:pageSize",
      this.getMyClients.bind(this)
    );
  }

  async getMyClients(req, res) {
    try {
      const pageNum = req.params.pageNum;
      const pageSize = req.params.pageSize;
      const id = req.user._id;
      const search = req.query.search;
      const data = await this.repository.findUserClients(
        id,
        pageNum,
        pageSize,
        search
      );
      this._success(res, data);
    } catch (e) {
      this._error(res, e);
    }
  }
}

export default MyClientsController;
