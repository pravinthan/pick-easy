let mongoose = require("mongoose");
let RewardTemplate = mongoose.model("RewardTemplate");

/* Controller function that retrieves all the reward templates */
module.exports.retrieveAllTemplates = async (req, res) => {
  try {
    res.json(await RewardTemplate.find({}));
  } catch (err) {
    res.sendStatus(500);
  }
};
