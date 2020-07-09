let mongoose = require("mongoose");
let AchievementTemplate = mongoose.model("AchievementTemplate");

module.exports.retrieveAllTemplates = async (req, res) => {
  try {
    res.json(await AchievementTemplate.find({}));
  } catch (err) {
    res.sendStatus(500);
  }
};
