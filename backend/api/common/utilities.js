const { DataTypes } = require("sequelize");

const UtilityMembers = (() => {
  const COMMON_MODEL_FIELDS = {
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
    min_escrow_amount: {
      type: DataTypes.BIGINT,
      defaultValue: "0",
    },
    escrow_amount: {
      type: DataTypes.BIGINT,
      defaultValue: "0",
    },
    commission_wallet: {
      type: DataTypes.STRING,
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
  };

  return { COMMON_MODEL_FIELDS };
})();

module.exports = { UtilityMembers };
