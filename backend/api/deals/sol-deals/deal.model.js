const { db } = require("../../config/db.config"),
  { UtilityMembers } = require("../../common/utilities"),
  { DataTypes } = require("sequelize"),
  { ALTER_DB } = require("../../config/env");

const SolDealsModel = db.define("sol-deals", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  ...UtilityMembers.COMMON_MODEL_FIELDS,
});

SolDealsModel.sync({ alter: ALTER_DB == "true" ? true : false });

module.exports = { SolDealsModel };
