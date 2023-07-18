const router = require("express").Router();
const { DealHandlers } = require("./deal.handlers");
const { reqMiddleware } = require("../../middleware/request.middleware");
const { validationSchemas } = require("./deal.validationSchema");
const { ConstantMembers } = require("../../common/members");

router.get(
  ConstantMembers.ENDPOINTS.ROOT,
  [reqMiddleware.validateQueryParam(validationSchemas.getDealSchema)],
  DealHandlers.getHandler
);

router.get(
  ConstantMembers.ENDPOINTS.SOLANA.ACCEPT_LINK_VALID,
  [reqMiddleware.validateQueryParam(validationSchemas.acceptDealSchema)],
  DealHandlers.acceptHandler
);

router.post(
  ConstantMembers.ENDPOINTS.ROOT,
  [reqMiddleware.validateReqBody(validationSchemas.addDealReqSchema)],
  DealHandlers.postHandler
);

router.post(
  ConstantMembers.ENDPOINTS.SEARCH,
  [
    reqMiddleware.validateReqBody(validationSchemas.searchReqSchema),
    reqMiddleware.validateQueryParam(validationSchemas.paginationParams),
  ],
  DealHandlers.searchHandler
);

router.patch(
  ConstantMembers.ENDPOINTS.SOLANA.SET_ESCROW_ADDRESS,
  [reqMiddleware.validateReqBody(validationSchemas.acceptDealSchema)],
  DealHandlers.setEscrowAddrHandler
);

router.patch(
  ConstantMembers.ENDPOINTS.SOLANA.DEPOSIT,
  [reqMiddleware.validateReqBody(validationSchemas.acceptDealSchema)],
  DealHandlers.depositHandler
);

router.patch(
  ConstantMembers.ENDPOINTS.SOLANA.ACCEPT_DEAL,
  [reqMiddleware.validateReqBody(validationSchemas.acceptDealSchema)],
  DealHandlers.acceptDealHandler
);

router.patch(
  ConstantMembers.ENDPOINTS.SOLANA.RELEASE_FUND,
  [reqMiddleware.validateReqBody(validationSchemas.acceptDealSchema)],
  DealHandlers.releaseFundHandler
);

router.patch(
  ConstantMembers.ENDPOINTS.SOLANA.WITHDRAW_FUND,
  [reqMiddleware.validateReqBody(validationSchemas.acceptDealSchema)],
  DealHandlers.withdrawFundHandler
);

module.exports = router;
