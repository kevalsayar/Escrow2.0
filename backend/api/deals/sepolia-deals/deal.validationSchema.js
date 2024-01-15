const joi = require("joi"),
  deal_title = joi.string().min(5).label("Title").messages({
    "any.required": "Deal Title is a required parameter!",
    "string.min": "Title length must be at least 5 characters long",
  }),
  deal_description = joi.string().min(10).label("Description").messages({
    "any.required": "Deal Description is a required parameter!",
    "string.min": "Description length must be at least 10 characters long!",
  }),
  deal_id = joi.string().guid({ version: "uuidv4" }).label("Deal Id").messages({
    "any.required": "Deal ID is a required parameter!",
    "string.guid": "Deal Id must be a valid GUID!",
  }),
  wallet_address = joi
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .label("Wallet Address")
    .messages({
      "any.required": "Wallet Address is a required parameter!",
      "string.pattern.base": "Wallet Address is not a valid Ethereum address!",
    }),
  deal_token = joi.string().valid("USDT").label("Deal Token").messages({
    "any.required": "Deal Token is a required parameter!",
    "any.only": "Deal Token must be USDT!",
  }),
  escrow_amount = joi
    .number()
    .label("Token Amount")
    .messages({ "any.required": "Token Amount is a required parameter!" }),
  page_num = joi.number().min(1).label("Page Number").messages({
    "any.required": "Page Number is a required parameter!",
    "number.min": "Page Number must be greater than or equal to 1",
  }),
  record_limit = joi.number().min(1).label("Record Limit").messages({
    "any.required": "Record Limit is a required parameter!",
    "number.min": "Record Limit must be greater than or equal to 1",
  }),
  filter = joi
    .string()
    .valid("buyer_wallet", "seller_wallet")
    .label("Filter String")
    .messages({
      "any.required": "Filter is a required parameter!",
      "any.only": "Filter String must be one of [buyer_wallet, seller_wallet]",
    }),
  searchValue = joi.string().min(3).label("Search Value").messages({
    "any.required": "Search Value is a required parameter!",
    "string.min": "Search Value must be at least 3 characters long!",
  });

const validationSchemas = (() => {
  const addDealReqSchema = joi.object({
    deal_title: deal_title.required(),
    deal_description: deal_description.required(),
    deal_token: deal_token.required(),
    wallet_address: wallet_address.required(),
    escrow_amount: escrow_amount.required(),
  });

  const getDealSchema = joi.object({
    wallet_address: joi
      .alternatives()
      .conditional("deal_id", {
        is: joi.exist(),
        then: joi.forbidden(),
        otherwise: joi.required(),
      })
      .messages({
        "any.unknown": "Deal Id and Wallet Address cannot be allowed together!",
      }),
    deal_id: joi
      .alternatives()
      .conditional("wallet_address", {
        is: joi.exist(),
        then: joi.forbidden(),
        otherwise: joi.required(),
      })
      .messages({
        "any.unknown": "Deal Id and Wallet Address cannot be allowed together!",
      }),
    page_num: joi
      .when("wallet_address", {
        is: joi.exist(),
        then: joi.required(),
        otherwise: joi.forbidden(),
      })
      .messages({
        "any.required": "Page number is required!",
      }),
    record_limit: joi
      .when("wallet_address", {
        is: joi.exist(),
        then: joi.required(),
        otherwise: joi.forbidden(),
      })
      .messages({
        "any.required": "Record Limit is required!",
      }),
    filter: joi
      .when("wallet_address", {
        is: joi.exist(),
        then: joi.required(),
        otherwise: joi.forbidden(),
      })
      .messages({
        "any.required": "Filter is required!",
      }),
  });

  const paginationParams = joi.object({
    page_num: page_num.required(),
    record_limit: record_limit.required(),
  });

  const searchReqSchema = joi.object({
    searchValue: searchValue.required(),
    wallet_address: wallet_address.required(),
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
})();

module.exports = { validationSchemas };
