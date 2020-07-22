let mongoose = require("mongoose");
let { validationResult } = require("express-validator");
let Restaurant = mongoose.model("Restaurant");
let User = mongoose.model("User");
let AchievementTemplate = mongoose.model("AchievementTemplate");

const isBadRequest = (req) => !validationResult(req).isEmpty();

module.exports.addAchievement = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    let user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).send(`User ${req.params.userId} does not exist`);

    if (!user._id.equals(req.user._id)) return res.status(401);

    let restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant)
      return res
        .status(404)
        .send(`Restaurant ${req.body.restaurantId} does not exist`);

    let restaurantAchievement = restaurant.achievements.find((achievement) =>
      achievement._id.equals(req.body.restaurantAchievementId)
    );
    if (!restaurantAchievement)
      return res
        .status(404)
        .send(
          `Restaurant achievement ${req.body.restaurantAchievementId} does not exist`
        );

    let newAchievement = {
      restaurantAchievementId: restaurantAchievement._id,
      progress: 0,
      complete: false,
    };

    if (
      user.loyalties.find((loyalty) =>
        loyalty.restaurantId.equals(restaurant._id)
      )
    ) {
      user = await User.findOneAndUpdate(
        { _id: req.user._id, "loyalties.restaurantId": restaurant._id },
        {
          $push: {
            "loyalties.$.achievements": newAchievement,
          },
        },
        { new: true }
      );
    } else {
      user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: {
            loyalties: {
              restaurantId: restaurant._id,
              numberOfTickets: 0,
              level: "Bronze",
              achievements: [newAchievement],
            },
          },
        },
        { new: true }
      );
    }

    res.json(user);
  } catch (err) {
    return res.sendStatus(500);
  }
};

module.exports.progressAchievement = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    let customer = await User.findById(req.params.userId);
    if (!customer)
      return res
        .status(404)
        .send(`Customer ${req.params.userId} does not exist`);

    let restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant)
      return res
        .status(404)
        .send(`Restaurant ${req.body.restaurantId} does not exist`);

    if (!restaurant.staff._id.equals(req.user._id)) return res.status(401);

    let restaurantAchievement = restaurant.achievements.find((achievement) =>
      achievement._id.equals(req.body.restaurantAchievementId)
    );
    if (!restaurantAchievement)
      return res
        .status(404)
        .send(
          `Restaurant achievement ${req.body.restaurantAchievementId} does not exist`
        );

    let achievementTemplate = await AchievementTemplate.findOne({
      templateNumber: restaurantAchievement.templateNumber,
    });

    let achievementTemplateVariableIndex = achievementTemplate.variables.findIndex(
      (variable) => variable.isProgressionVariable
    );

    for (let i = 0; i < customer.loyalties.length; i++) {
      if (customer.loyalties[i].restaurantId.equals(restaurant._id)) {
        for (let j = 0; j < customer.loyalties[i].achievements.length; j++) {
          // If the restaurant achievement ID matches
          if (
            customer.loyalties[i].achievements[
              j
            ].restaurantAchievementId.equals(restaurantAchievement._id)
          ) {
            if (achievementTemplate.typeOfAchievement == "progress") {
              // If the progress < max progression, we can increment it
              if (
                customer.loyalties[i].achievements[j].progress <
                restaurantAchievement.variables[
                  achievementTemplateVariableIndex
                ]
              ) {
                customer.loyalties[i].achievements[j].progress += 1;
              }

              // If the progress is now equal to (or greater than) max progression, we can set complete as true
              if (
                customer.loyalties[i].achievements[j].progress >=
                restaurantAchievement.variables[
                  achievementTemplateVariableIndex
                ]
              ) {
                customer.loyalties[i].achievements[j].complete = true;
              }
            } else if (achievementTemplate.typeOfAchievement == "oneOff") {
              customer.loyalties[i].achievements[j].complete = true;
            }

            await customer.save();
            break;
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
