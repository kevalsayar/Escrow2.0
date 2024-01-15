const joi = require("joi"),
  deal_title = joi.string().min(5).label("Title"),
  deal_description = joi.string().min(10).label("Description"),
  deal_id = joi.string().guid({ version: "uuidv4" }).label("Deal Id").messages({
    "any.required": "Deal ID is a required parameter!",
  }),
  wallet_address = joi
    .string()
    .regex(/^T[a-zA-Z0-9]{33}$/)
    .label("Wallet Address"),
  deal_token = joi.string().valid("USDT").label("Deal Token"),
  page_num = joi.number().min(1).label("Page Number").messages({
    "any.required": "Page Number is a required parameter!",
  }),
  record_limit = joi.number().min(1).label("Record Limit").messages({
    "any.required": "Record Limit is a required parameter!",
  }),
  filter = joi
    .string()
    .valid("buyer_wallet", "seller_wallet")
    .label("Filter String")
    .messages({
      "any.required": "Filter is a required parameter!",
    }),
  searchValue = joi.string().min(3).label("Search Value");

const valSchemas = () => {
  const addDealReqSchema = joi.object({
    deal_title: deal_title.required().messages({
      "any.required": "Deal Title is a required parameter!",
    }),
    deal_description: deal_description.required().messages({
      "any.required": "Deal Description is a required parameter!",
    }),
    deal_token: deal_token.required().messages({
      "any.required": "Deal Token is a required parameter!",
    }),
  });

  const getDealSchema = joi
    .object({
      deal_id: deal_id,
      wallet_address: wallet_address.messages({
        "string.pattern.base": "Wallet Address is not a valid Tron address!",
      }),
      page_num: page_num,
      record_limit: record_limit,
      filter: filter,
    })
    .when(".deal_id", {
      is: joi.exist(),
      then: joi.object({ wallet_address: wallet_address.optional() }),
      otherwise: joi.object({ wallet_address: wallet_address.required() }),
    })
    .when(".wallet_address", {
      is: joi.exist(),
      then: joi.object({
        filter: filter.required(),
        page_num: page_num.required(),
        record_limit: record_limit.required(),
      }),
      otherwise: {
        filter: filter.optional(),
        page_num: page_num.optional(),
        record_limit: record_limit.optional(),
      },
    });

  const paginationParams = joi.object({
    page_num: page_num.required(),
    record_limit: record_limit.required(),
  });

  const searchReqSchema = joi.object({
    searchValue: searchValue.required().messages({
      "any.required": "Search Value is a required parameter!",
    }),
    wallet_address: wallet_address.required().messages({
      "any.required": "Wallet Address is a required parameter!",
      "string.pattern.base": "Wallet Address is not a valid Ethereum address!",
    }),
    filter: filter.required(),
  });

  const acceptDealSchema = joi.object({
    deal_id: deal_id.required(),
  });

  return {
    addDealReqSchema,
    getDealSchema,
    paginationParams,
    searchReqSchema,
    acceptDealSchema,
  };
};

module.exports = {
  validationSchemas: valSchemas(),
};
