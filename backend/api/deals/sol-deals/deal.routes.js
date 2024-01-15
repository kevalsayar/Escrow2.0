const router = require("express").Router(),
  { DealHandlers } = require("./deal.handlers"),
  { DealServices } = require("./deal.services"),
  { reqMiddleware } = require("../../middleware/request.middleware"),
  { validationSchemas } = require("./deal.validationSchema"),
  { ConstantMembers } = require("../../common/members"),
  asyncHandler = require("express-async-handler");

router
  .route(ConstantMembers.ENDPOINTS.ROOT)
  .get(
    [reqMiddleware.validateData(validationSchemas.getDealSchema, "query")],
    asyncHandler(DealHandlers.getHandler)
  )
  .post(
    [reqMiddleware.validateData(validationSchemas.addDealReqSchema, "body")],
    asyncHandler(DealHandlers.postHandler)
  );

router.get(
  ConstantMembers.ENDPOINTS.SOLANA.ACCEPT_LINK_VALID,
  [reqMiddleware.validateData(validationSchemas.acceptDealSchema, "query")],
  asyncHandler(DealHandlers.acceptHandler)
);

router.post(
  ConstantMembers.ENDPOINTS.SEARCH,
  [
    reqMiddleware.validateData(validationSchemas.searchReqSchema, "body"),
    reqMiddleware.validateData(validationSchemas.paginationParams, "query"),
  ],
  asyncHandler(DealHandlers.searchHandler)
);

router.patch(
  ConstantMembers.ENDPOINTS.SOLANA.SET_ESCROW_ADDRESS,
  [reqMiddleware.validateData(validationSchemas.dealIdSchema, "body")],
  asyncHandler(
    DealHandlers.solanaEscrowHandler(DealServices.setEscrowAccountId)
  )
);

router.patch(
  ConstantMembers.ENDPOINTS.SOLANA.DEPOSIT,
  [reqMiddleware.validateData(validationSchemas.fundTransferSchema, "body")],
  asyncHandler(DealHandlers.solanaEscrowHandler(DealServices.depositService))
);

router.patch(
  ConstantMembers.ENDPOINTS.SOLANA.ACCEPT_DEAL,
  [reqMiddleware.validateData(validationSchemas.dealIdSchema, "body")],
  asyncHandler(DealHandlers.solanaEscrowHandler(DealServices.acceptDealService))
);

router.patch(
  ConstantMembers.ENDPOINTS.SOLANA.RELEASE_FUND,
  [reqMiddleware.validateData(validationSchemas.fundTransferSchema, "body")],
  asyncHandler(
    DealHandlers.solanaEscrowHandler(DealServices.releaseFundService)
  )
);

router.patch(
  ConstantMembers.ENDPOINTS.SOLANA.WITHDRAW_FUND,
  [reqMiddleware.validateData(validationSchemas.fundTransferSchema, "body")],
  asyncHandler(
    DealHandlers.solanaEscrowHandler(DealServices.withdrawFundService)
  )
);

module.exports = router;
