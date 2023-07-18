const { DealServices } = require("./deal.services");

const DealHandlers = function () {
  /**
   * @param { Request } req
   * @param { Response } res
   */
  const getHandler = async function (req, res) {
    const response = await DealServices.getDealDetails(req.query);
    res.status(response.code).json(response);
  };

  /**
   * @param { Request } req
   * @param { Response } res
   */
  const postHandler = async function (req, res) {
    const response = await DealServices.addDealDetails(req.body);
    res.status(response.code).json(response);
  };

  /**
   * @param { Request } req
   * @param { Response } res
   */
  const patchHandler = async function (req, res) {};

  /**
   * @param { Request } req
   * @param { Response } res
   */
  const deleteHandler = async function (req, res) {};

  /**
   * @param { Request } req
   * @param { Response } res
   */
  const searchHandler = async function (req, res) {
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
  const acceptHandler = async function (req, res) {
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
