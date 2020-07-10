let mongoose = require("mongoose");
let RewardTemplate = mongoose.model("RewardTemplate");

module.exports.retrieveAllTemplates = async (req, res) => {
  try {
    res.json(await RewardTemplate.find({}));
  } catch (err) {
    res.sendStatus(500);
  }
};
