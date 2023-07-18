const router = require("express").Router(),
  dealRoutes = require("./deals/index"),
  { ConstantMembers } = require("./common/members");

router.use(ConstantMembers.ENDPOINTS.DEAL, dealRoutes);

module.exports = router;
