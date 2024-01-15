const { db } = require("../../config/db.config"),
  { DataTypes } = require("sequelize"),
  { UtilityMembers } = require("../../common/utilities"),
  { ALTER_DB } = require("../../config/env");

const SepoliaDealsModel = db.define("sepolia-deals", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ...UtilityMembers.COMMON_MODEL_FIELDS,
});

SepoliaDealsModel.sync({ alter: ALTER_DB == "true" ? true : false });

module.exports = { SepoliaDealsModel };
