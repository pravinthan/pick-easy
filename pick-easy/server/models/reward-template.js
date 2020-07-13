let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let rewardTemplateSchema = new Schema([
  {
    /*
  Example:
  content: "Get <number>% Off!",
  variables: ["Percent"],
  level: "",
  */
    templateNumber: Number,
    content: String,
    variables: [String],
    level: String,
  },
]);

let RewardTemplate = mongoose.model("RewardTemplate", rewardTemplateSchema);

(async () => {
  try {
    await RewardTemplate.collection.drop();
  } catch (error) {}

  await RewardTemplate.create([
    {
      templateNumber: 0,
      content: "Get <number>% Off!",
      variables: ["Percent"],
      level: "",
    },
    {
      templateNumber: 1,
      content: "Get <restaurant item> for free with purchased with <restaurant item>!",
      variables: [ "Restaurant Item","Restaurant Item"],
      level: "",
    },
  ]);
})();