const router = require("express").Router(),
  { DealHandlers } = require("./deal.handlers"),
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
  ConstantMembers.ENDPOINTS.ACCEPT_DEAL,
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

module.exports = router;
