const router = require("express").Router(),
  sepoliaDealRoutes = require("./sepolia-deals/deal.routes"),
  // tronDealRoutes = require("./tron-deals/deal.routes"),
  solDealRoutes = require("./sol-deals/deal.routes"),
  { ConstantMembers } = require("../common/members");

router.use(ConstantMembers.ENDPOINTS.SEPOLIA.SEPOLIA_DEALS, sepoliaDealRoutes);
// router.use(ConstantMembers.ENDPOINTS.TRON.TRON_DEALS, tronDealRoutes);
router.use(ConstantMembers.ENDPOINTS.SOLANA.SOL_DEALS, solDealRoutes);

module.exports = router;
