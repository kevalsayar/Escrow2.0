const { DealServices } = require("./deal.services");

const DealHandlers = (() => {
  /**
   * @description Handles the HTTP GET request to retrieve SolDeal details.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   */
  const getHandler = async (req, res) => {
    const response = await DealServices.getDealDetails(req.query);
    res.status(response.code).json(response);
  };

  /**
   * @description Handles the HTTP POST request to add SolDeal details.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   */
  const postHandler = async (req, res) => {
    const response = await DealServices.addDealDetails(req.body);
    res.status(response.code).json(response);
  };

  /**
   * @description Handles the HTTP POST request to search for SolDeal details.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   */
  const searchHandler = async (req, res) => {
    const response = await DealServices.searchInfoOfDeal({
      ...req.query,
      ...req.body,
    });
    res.status(response.code).json(response);
  };

  /**
   * @description  Handles the HTTP GET request to check the eligibility of a SolDeal for acceptance.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   */
  const acceptHandler = async (req, res) => {
    const response = await DealServices.acceptDealCheck(req.query);
    res.status(response.code).json(response);
  };

  /**
   * @description Handles Solana escrow-related HTTP requests by executing the specified service function.
   * @param {Function} serviceFun - The Solana escrow service function to be executed.
   * @returns {Function} Express handler function for Solana escrow-related HTTP requests.
   */
  const solanaEscrowHandler = (serviceFun) => async (req, res) => {
    const response = await serviceFun(req.body);
    res.status(response.code).json(response);
  };

  return {
    getHandler,
    postHandler,
    searchHandler,
    acceptHandler,
    solanaEscrowHandler,
  };
})();

module.exports = { DealHandlers };
