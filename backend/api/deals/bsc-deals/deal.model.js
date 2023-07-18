const { db } = require("../../config/db.config");
const { DataTypes } = require("sequelize");
const { INIT_DB } = require("../../config/env");

const BscDeal = db.define("bsc-deals", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  deal_status: {
    type: DataTypes.ENUM(
      "INIT",
      "FUNDED",
      "ACCEPTED",
      "RELEASED",
      "REFUNDED",
      "WITHDRAWN_BY_OWNER"
    ),
    defaultValue: "INIT",
  },
  deal_title: {
    type: DataTypes.STRING,
  },
  deal_description: {
    type: DataTypes.STRING,
  },
  buyer_wallet: {
    type: DataTypes.STRING,
  },
  seller_wallet: {
    type: DataTypes.STRING,
  },
  escrow_wallet: {
    type: DataTypes.STRING,
  },
  commission_wallet: {
    type: DataTypes.STRING,
  },
  min_escrow_amount: {
    type: DataTypes.BIGINT,
    defaultValue: "0",
  },
  escrow_amount: {
    type: DataTypes.BIGINT,
    defaultValue: "0",
  },
  deal_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fund_tx_hash: {
    type: DataTypes.STRING,
  },
  release_tx_hash: {
    type: DataTypes.STRING,
  },
  released_by: {
    type: DataTypes.STRING,
  },
  released_amount: {
    type: DataTypes.STRING,
    defaultValue: "0",
  },
  commission_amount: {
    type: DataTypes.STRING,
    defaultValue: "0",
  },
  commission_rate: {
    type: DataTypes.FLOAT,
  },
  deal_link: {
    type: DataTypes.STRING,
  },
  isDealLinkActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
});

BscDeal.sync({ force: INIT_DB == "true" ? true : false });
module.exports = { BscDeal };
