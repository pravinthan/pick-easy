let mongoose = require("mongoose");
let { validationResult } = require("express-validator");
let Restaurant = mongoose.model("Restaurant");
let User = mongoose.model("User");

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
