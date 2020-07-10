let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let rewardTemplateSchema = new Schema([
  {
    /*
  Example:
  content: Get <number>% Off!,
  value: Get:variable% Off!,
  variables: [{
      variableDescription: "Percent",
      variableType: "number",
    }
  ]
  */
    templateNumber: Number,
    content: String,
    value: String,
    variables: [
      {
        variableDescription: String,
        variableType: String,
      },
    ],
    level: String,
  },
]);

mongoose.model("RewardTemplate", rewardTemplateSchema);
