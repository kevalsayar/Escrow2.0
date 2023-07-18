const router = require("express").Router(),
  bscDealRoutes = require("./bsc-deals/deal.routes"),
  tronDealRoutes = require("./tron-deals/deal.routes"),
  solDealRoutes = require("./sol-deals/deal.routes"),
  { ConstantMembers } = require("../common/members");

router.use(ConstantMembers.ENDPOINTS.BSC.BSC_DEALS, bscDealRoutes);
router.use(ConstantMembers.ENDPOINTS.TRON.TRON_DEALS, tronDealRoutes);
router.use(ConstantMembers.ENDPOINTS.SOLANA.SOL_DEALS, solDealRoutes);

module.exports = router;
