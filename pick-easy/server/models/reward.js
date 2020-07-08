let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let rewardSchema = new Schema({
  owner: {
    _id: {
      type: Schema.Types.ObjectId,
    },
  },
  /*
  Example:
  order: ["text", "form", "text"]
  text: ["Get", "Off!"]
  form: ["Percent"]
  
  Result
  Get ___% Off!
  */
  order: {
    type: [String],
    enum: [
      "text",
      "form",
    ],
  },
  text: [String],
  form: {
    type: [String],
    enum: [
      "Dollar",
      "Percent",
      "Restaurant Item",
    ]
  }
});

mongoose.model("Reward", reward);
