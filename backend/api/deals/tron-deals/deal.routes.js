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
  ConstantMembers.ENDPOINTS.ACCEPT_DEAL,
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

module.exports = router;
