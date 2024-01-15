const { db } = require("../../config/db.config"),
  { UtilityMembers } = require("../../common/utilities"),
  { DataTypes } = require("sequelize"),
  { ALTER_DB } = require("../../config/env");

const TronDealsModel = db.define("tron-deals", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ...UtilityMembers.COMMON_MODEL_FIELDS,
});

TronDealsModel.sync({ alter: ALTER_DB == "true" ? true : false });

module.exports = { TronDealsModel };
