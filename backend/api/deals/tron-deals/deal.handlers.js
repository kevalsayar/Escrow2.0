const { DealServices } = require("./deal.services");

const DealHandlers = () => {
  /**
   * @param { Request } req
   * @param { Response } res
   */
  const getHandler = async (req, res) => {
    const response = await DealServices.getDealDetails(req.query);
    res.status(response.code).json(response);
  };

  /**
   * @param { Request } req
   * @param { Response } res
   */
  const postHandler = async (req, res) => {
    const response = await DealServices.addDealDetails(req.body);
    res.status(response.code).json(response);
  };

  /**
   * @param { Request } req
   * @param { Response } res
   */
  const patchHandler = async (req, res) => {};

  /**
   * @param { Request } req
   * @param { Response } res
   */
  const deleteHandler = async (req, res) => {};

  /**
   * @param { Request } req
   * @param { Response } res
   */
  const searchHandler = async (req, res) => {
    const response = await DealServices.searchInfoOfDeal({
      ...req.query,
      ...req.body,
    });
    res.status(response.code).json(response);
  };

  /**
   * @param {Request} req
   * @param {Response} res
   */
  const acceptHandler = async (req, res) => {
    const response = await DealServices.acceptDealCheck(req.query);
    res.status(response.code).json(response);
  };

  return {
    getHandler,
    postHandler,
    patchHandler,
    deleteHandler,
    searchHandler,
    acceptHandler,
  };
};

module.exports = {
  DealHandlers: DealHandlers(),
};
