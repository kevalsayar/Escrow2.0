const { DealServices } = require("./deal.services");

const DealHandlers = (() => {
  /**
   * @description Handles the HTTP GET request to retrieve deal details based on query parameters.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {void}
   */
  const getHandler = async (req, res) => {
    const response = await DealServices.getDealDetails(req.query);
    res.status(response.code).json(response);
  };

  /**
   * @description Handles the HTTP POST request to add deal details based on the request body.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {void}
   */
  const postHandler = async (req, res) => {
    const response = await DealServices.addDealDetails(req.body);
    res.status(response.code).json(response);
  };

  /**
   * @description Handles the HTTP request to search for information about a deal based on query parameters and request body.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {void}
   */
  const searchHandler = async (req, res) => {
    const response = await DealServices.searchInfoOfDeal({
      ...req.query,
      ...req.body,
    });
    res.status(response.code).json(response);
  };

  /**
   * @description  Handles the HTTP request to check and accept a deal based on query parameters.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {void}
   */
  const acceptHandler = async (req, res) => {
    const response = await DealServices.acceptDealCheck(req.query);
    res.status(response.code).json(response);
  };

  return {
    getHandler,
    postHandler,
    searchHandler,
    acceptHandler,
  };
})();

module.exports = { DealHandlers };
