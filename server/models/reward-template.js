let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let rewardTemplateSchema = new Schema([
  {
    templateNumber: Number,
    content: String,
    value: String,
    variables: [String],
  },
]);

let RewardTemplate = mongoose.model(
  "RewardTemplate",
  rewardTemplateSchema,
  "reward-templates"
);

// Put the templates in the database
(async () => {
  try {
    await RewardTemplate.collection.drop();
  } catch (error) {}

  await RewardTemplate.create([
    {
      templateNumber: 0,
      content: "Get <percentage>% off for all purchases",
      value: "Get :variable% off for all purchases",
      variables: ["Percent"],
    },
    {
      templateNumber: 1,
      content:
        "Spend $<amount> or more pre-tax and get <restaurant item> for FREE",
      value: "Spend $:variable or more pre-tax and get :variable for FREE",
      variables: ["Dollar", "Restaurant Item"],
    },
    {
      templateNumber: 2,
      content: "Purchase <restaurant item> for $<amount> + tax",
      value: "Purchase :variable for $:variable + tax",
      variables: ["Restaurant Item", "Dollar"],
    },
    {
      templateNumber: 3,
      content: "Buy <restaurant item> and get <restaurant item> for FREE",
      value: "Buy :variable and get :variable for FREE",
      variables: ["Restaurant Item", "Restaurant Item"],
    },
    {
      templateNumber: 4,
      content: "Purchase <restaurant item> and get <percentage> off",
      value: "Purchase :variable and get :variable off",
      variables: ["Restaurant Item", "Percent"],
    },
    {
      templateNumber: 5,
      content: "Purchase <restaurant item> and get $<amount> off",
      value: "Purchase :variable and get $:variable off",
      variables: ["Restaurant Item", "Dollar"],
    },
    {
      templateNumber: 6,
      content: "FREE <restaurant item>",
      value: "FREE :variable",
      variables: ["Restaurant Item"],
    },
  ]);
})();
