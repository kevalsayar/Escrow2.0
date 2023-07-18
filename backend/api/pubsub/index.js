const events = require("events"),
  { HelperFunction } = require("./../common/helpers"),
  { ConstantMembers } = require("../common/members"),
  { mailDetails } = require("../common/utils"),
  em = new events.EventEmitter();

em.on("deal-created", async function (data) {
  mailDetails.to = data.email;
  mailDetails.subject = "Deal created";
  await HelperFunction.sendEmail(
    mailDetails,
    ConstantMembers.HTML_TEMPLATES.DEAL_CREATED,
    data
  );
});

em.on("deal-funded", async function (data) {
  mailDetails.subject = "Deal Funded";
  mailDetails.to = data.buyer_email;
  mailDetails.message = "Check your deal status!";
  await HelperFunction.sendEmail(
    mailDetails,
    ConstantMembers.HTML_TEMPLATES.DEAL_FUNDED,
    data
  );
  mailDetails.to = data.seller_email;
  mailDetails.message = "Accept or Reject deal!";
  await HelperFunction.sendEmail(
    mailDetails,
    ConstantMembers.HTML_TEMPLATES.DEAL_FUNDED,
    data
  );
});

em.on("deal-accepted", function (data) {
  data.subject = "Deal accepted";
  HelperFunction.sendEmail(data, "deal-accepted");
});

em.on("deal-fund-released", function () {
  HelperFunction.sendEmail(data, "fund-released");
});

em.on("deal-fund-withdrawed", function () {
  HelperFunction.sendEmail(data, "fund-released");
});

module.exports = { em };
