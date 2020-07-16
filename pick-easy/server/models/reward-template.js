let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let rewardTemplateSchema = new Schema([
  {
    /*
  Example:
  content: "Get <number>% Off!",
  variables: ["Percent"],
  */
    templateNumber: Number,
    content: String,
    variables: [String],
  },
]);

let RewardTemplate = mongoose.model(
  "RewardTemplate",
  rewardTemplateSchema,
  "reward-templates"
);

(async () => {
  try {
    await RewardTemplate.collection.drop();
  } catch (error) {}

  await RewardTemplate.create([
    {
      templateNumber: 0,
      content: "Get <percentage>% off for all purchases",
      variables: ["Percent"],
    },
    {
      templateNumber: 1,
      content:
        "Spend $<amount> or more pre-tax and get <restaurant item> for FREE",
      variables: ["Dollar", "Restaurant Item"],
    },
    {
      templateNumber: 2,
      content: "Purchase <restaurant item> for $<amount> + tax",
      variables: ["Restaurant Item", "Dollar"],
    },
    {
      templateNumber: 3,
      content: "Buy <restaurant item> and get <restaurant item> for FREE",
      variables: ["Restaurant Item", "Restaurant Item"],
    },
    {
      templateNumber: 4,
      content: "Purchase <restaurant item> and get <percentage> off",
      variables: ["Restaurant Item", "Percent"],
    },
    {
      templateNumber: 5,
      content: "Purchase <restaurant item> and get $<amount> off",
      variables: ["Restaurant Item", "Dollar"],
    },
    {
      templateNumber: 6,
      content: "FREE <restaurant item>",
      variables: ["Restaurant Item"],
    },
  ]);
})();
