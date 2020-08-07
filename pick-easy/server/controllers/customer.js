let mongoose = require("mongoose");
let { validationResult } = require("express-validator");
let Restaurant = mongoose.model("Restaurant");
let User = mongoose.model("User");
let AchievementTemplate = mongoose.model("AchievementTemplate");
let RewardTemplate = mongoose.model("RewardTemplate");

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

    let loyalty = user.loyalties.find((loyalty) =>
      loyalty.restaurantId.equals(restaurant._id)
    );
    if (loyalty) {
      if (
        loyalty.completedNonRepeatableAchievements.find(
          (completedNonRepeatableAchievement) =>
            completedNonRepeatableAchievement.restaurantAchievementId.equals(
              restaurantAchievement._id
            )
        )
      ) {
        return res
          .status(409)
          .send(
            `Restaurant achievement ${req.body.restaurantAchievementId} is not repeatable`
          );
      }

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
              rewards: [],
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

module.exports.updateAchievement = async (req, res) => {
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

    if (!achievementTemplate)
      return res
        .status(404)
        .send(
          `Restaurant achievement template ${restaurantAchievement.templateNumber} does not exist`
        );

    let achievementTemplateVariableIndex = achievementTemplate.variables.findIndex(
      (variable) => variable.isProgressionVariable
    );

    let addToRestaurantLog = async (
      restaurant,
      customer,
      achievementTemplate,
      restaurantAchievement,
      customerAchievementProgress,
      maxProgression,
      complete
    ) => {
      restaurant.log.achievements.push({
        customerId: customer._id,
        customerName: customer.firstName + " " + customer.lastName,
        achievement:
          achievementTemplate.value
            .split(":variable")
            .reduce(
              (result, text, i) =>
                result + text + (restaurantAchievement.variables[i] || ""),
              ""
            ) +
          " for " +
          restaurantAchievement.numberOfTickets +
          " Ticket" +
          (restaurantAchievement.numberOfTickets == 1 ? "" : "s"),
        progress: customerAchievementProgress + " / " + maxProgression,
        complete,
        timeOfScan: new Date(),
      });

      await restaurant.save();
    };

    let addToCustomerLog = async (
      restaurant,
      customer,
      achievementTemplate,
      restaurantAchievement,
      customerAchievementProgress,
      maxProgression,
      complete
    ) => {
      customer.log.achievements.push({
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        achievement:
          achievementTemplate.value
            .split(":variable")
            .reduce(
              (result, text, i) =>
                result + text + (restaurantAchievement.variables[i] || ""),
              ""
            ) +
          " for " +
          restaurantAchievement.numberOfTickets +
          " Ticket" +
          (restaurantAchievement.numberOfTickets == 1 ? "" : "s"),
        progress: customerAchievementProgress + " / " + maxProgression,
        complete,
        timeOfScan: new Date(),
      });

      await customer.save();
    };

    for (let i = 0; i < customer.loyalties.length; i++) {
      if (customer.loyalties[i].restaurantId.equals(restaurant._id)) {
        for (let j = 0; j < customer.loyalties[i].achievements.length; j++) {
          // If the restaurant achievement ID matches
          if (
            customer.loyalties[i].achievements[
              j
            ].restaurantAchievementId.equals(restaurantAchievement._id)
          ) {
            if (req.body.operation == "progress") {
              if (!restaurant.staff._id.equals(req.user._id))
                return res.status(401);

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

                await addToRestaurantLog(
                  restaurant,
                  customer,
                  achievementTemplate,
                  restaurantAchievement,
                  customer.loyalties[i].achievements[j].progress,
                  restaurantAchievement.variables[
                    achievementTemplateVariableIndex
                  ],
                  customer.loyalties[i].achievements[j].progress >=
                    restaurantAchievement.variables[
                      achievementTemplateVariableIndex
                    ]
                );

                await addToCustomerLog(
                  restaurant,
                  customer,
                  achievementTemplate,
                  restaurantAchievement,
                  customer.loyalties[i].achievements[j].progress,
                  restaurantAchievement.variables[
                    achievementTemplateVariableIndex
                  ],
                  customer.loyalties[i].achievements[j].progress >=
                    restaurantAchievement.variables[
                      achievementTemplateVariableIndex
                    ]
                );

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
                await addToRestaurantLog(
                  restaurant,
                  customer,
                  achievementTemplate,
                  restaurantAchievement,
                  1,
                  1,
                  true
                );
                await addToCustomerLog(
                  restaurant,
                  customer,
                  achievementTemplate,
                  restaurantAchievement,
                  1,
                  1,
                  true
                );
                customer.loyalties[i].achievements[j].complete = true;
              }
            } else if (req.body.operation == "redeem") {
              if (!customer._id.equals(req.user._id)) return res.status(401);

              if (!customer.loyalties[i].achievements[j].complete) {
                return res
                  .status(409)
                  .send(
                    "Customer achievement not complete. Complete the achievement before redeeming"
                  );
              }

              // Add the amount of tickets the achievement awards
              customer.loyalties[i].numberOfTickets +=
                restaurantAchievement.numberOfTickets;

              // Remove the achievement from the customer's achievements
              customer.loyalties[i].achievements.splice(j, 1);

              // Add the achievement to the list of non repeatable achievements if the achievement is not repeatable
              if (!achievementTemplate.repeatable) {
                customer.loyalties[i].completedNonRepeatableAchievements.push({
                  restaurantAchievementId: restaurantAchievement._id,
                });
              }
            }

            await customer.save();
            break;
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

module.exports.updateLevel = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    let customer = await User.findById(req.params.userId);
    if (!customer)
      return res
        .status(404)
        .send(`Customer ${req.params.userId} does not exist`);

    if (!customer._id.equals(req.user._id)) return res.status(401);

    let restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant)
      return res
        .status(404)
        .send(`Restaurant ${req.body.restaurantId} does not exist`);

    for (let i = 0; i < customer.loyalties.length; i++) {
      if (customer.loyalties[i].restaurantId.equals(restaurant._id)) {
        if (
          customer.loyalties[i].numberOfTickets <
          restaurant.numberOfTicketsForRedemption
        ) {
          return res.status(409).send(`Not enough tickets for redemption`);
        }
        // Reduce the amount of tickets after upgrading tier
        customer.loyalties[i].numberOfTickets -=
          restaurant.numberOfTicketsForRedemption;

        // Level the tier up
        if (customer.loyalties[i].level == "Bronze") {
          customer.loyalties[i].level = "Silver";
        } else if (customer.loyalties[i].level == "Silver") {
          customer.loyalties[i].level = "Gold";
        } else if (customer.loyalties[i].level == "Gold") {
          customer.loyalties[i].level = "Platinum";
        } else if (customer.loyalties[i].level == "Platinum") {
          customer.loyalties[i].level = "Diamond";
        } else if ((customer.loyalties[i].level = "Diamond")) {
          return res.status(409).send(`Already at max level`);
        }

        await customer.save();
        break;
      }
    }

    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

module.exports.removeReward = async (req, res) => {
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

    let loyalty = customer.loyalties.find((loyalty) =>
      loyalty.restaurantId.equals(restaurant._id)
    );

    if (!loyalty)
      return res
        .status(404)
        .send(
          `Customer loyalty for Restaurant ${restaurant._id} does not exist`
        );

    let customerReward = loyalty.rewards.find((reward) =>
      reward._id.equals(req.body.customerRewardId)
    );

    if (!customerReward)
      return res
        .status(404)
        .send(`Customer reward ${req.body.customerRewardId} does not exist`);

    for (let i = 0; i < customer.loyalties.length; i++) {
      if (customer.loyalties[i].restaurantId.equals(restaurant._id)) {
        for (let j = 0; j < customer.loyalties[i].rewards.length; j++) {
          // If the restaurant reward ID matches
          if (customer.loyalties[i].rewards[j]._id.equals(customerReward._id)) {
            // Pushes the reward to log
            restaurant.log.rewards.push({
              customerId: customer._id,
              customerName: customer.firstName + " " + customer.lastName,
              reward: customerReward.content,
              level: customerReward.level,
              timeOfScan: new Date(),
            });
            customer.log.rewards.push({
              restaurantId: restaurant._id,
              restaurantName: restaurant.name,
              reward: customerReward.content,
              level: customerReward.level,
              timeOfScan: new Date(),
            });
            // Remove the reward from the customer's rewards
            customer.loyalties[i].rewards.splice(j, 1);
            await restaurant.save();
            await customer.save();
            break;
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

module.exports.generateReward = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    let customer = await User.findById(req.params.userId);
    if (!customer)
      return res.status(404).send(`User ${req.params.userId} does not exist`);

    if (!customer._id.equals(req.user._id)) return res.status(401);

    let restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant)
      return res
        .status(404)
        .send(`Restaurant ${req.body.restaurantId} does not exist`);

    let customerLoyaltyForRestaurant = customer.loyalties.find((loyalty) =>
      restaurant._id.equals(loyalty.restaurantId)
    );

    if (!customerLoyaltyForRestaurant)
      return res
        .status(404)
        .send(
          `Customer loyalty for restaurant ${req.body.restaurantId} does not exist`
        );

    if (
      customerLoyaltyForRestaurant.numberOfTickets <
      restaurant.numberOfTicketsForRedemption
    )
      return res.status(409).send(`Not enough tickets to roll for reward`);

    let bronzeLoyalty = customerLoyaltyForRestaurant.level == "Bronze";
    let silverLoyalty = customerLoyaltyForRestaurant.level == "Silver";
    let goldLoyalty = customerLoyaltyForRestaurant.level == "Gold";
    let platinumLoyalty = customerLoyaltyForRestaurant.level == "Platinum";
    let diamondLoyalty = customerLoyaltyForRestaurant.level == "Diamond";

    let allowedRestaurantRewards = restaurant.rewards.filter((reward) => {
      let filter = false;
      if (
        bronzeLoyalty ||
        silverLoyalty ||
        goldLoyalty ||
        platinumLoyalty ||
        diamondLoyalty
      )
        filter = filter || reward.level == "Bronze";
      if (silverLoyalty || goldLoyalty || platinumLoyalty || diamondLoyalty)
        filter = filter || reward.level == "Silver";
      if (goldLoyalty || platinumLoyalty || diamondLoyalty)
        filter = filter || reward.level == "Gold";
      if (platinumLoyalty || diamondLoyalty)
        filter = filter || reward.level == "Platinum";
      if (diamondLoyalty) filter = filter || reward.level == "Diamond";
      return filter;
    });

    let getLevelsUnder = (level) => {
      let levels = [];
      let bronze = level == "Bronze";
      let silver = level == "Silver";
      let gold = level == "Gold";
      let platinum = level == "Platinum";
      let diamond = level == "Diamond";
      if (bronze || silver || gold || platinum || diamond)
        levels.push("Bronze");
      if (silver || gold || platinum || diamond) levels.push("Silver");
      if (gold || platinum || diamond) levels.push("Gold");
      if (platinum || diamond) levels.push("Platinum");
      if (diamond) levels.push("Diamond");
      return levels;
    };

    let calculateNewWeight = (level, customerLevel, rewardWeight) => {
      let total = 0;
      let levels = getLevelsUnder(customerLevel);
      for (let i = 0; i < levels.length; i++) {
        total += rewardWeight[levels[i].toLowerCase()];
      }
      if (total == 0) return 0;
      return rewardWeight[level.toLowerCase()] / total;
    };

    let allowedLevels = Array.from(
      new Set(
        allowedRestaurantRewards.map(
          (allowedRestaurantReward) => allowedRestaurantReward.level
        )
      )
    );

    let allowedWeights = allowedLevels.map((level) =>
      calculateNewWeight(
        level,
        customerLoyaltyForRestaurant.level,
        restaurant.rewardWeight
      )
    );

    let getRandomLevel = (weights, levels) => {
      let num = Math.random(),
        s = 0,
        lastIndex = weights.length - 1;

      for (let i = 0; i < lastIndex; ++i) {
        s += weights[i];
        if (num < s) {
          return levels[i];
        }
      }

      return levels[lastIndex];
    };

    let randomLevel = getRandomLevel(allowedWeights, allowedLevels);

    let allowedRandomRewards = restaurant.rewards.filter(
      (reward) => reward.level == randomLevel
    );

    let randomReward = Math.floor(Math.random() * allowedRandomRewards.length);

    let randomRestaurantReward = allowedRandomRewards[randomReward];

    let rewardTemplate = await RewardTemplate.findOne({
      templateNumber: randomRestaurantReward.templateNumber,
    });

    if (!rewardTemplate)
      return res
        .status(404)
        .send(
          `Restaurant rewards template ${randomRestaurantReward.templateNumber} does not exist`
        );

    let newRandomReward = {
      content: rewardTemplate.value
        .split(":variable")
        .reduce(
          (result, text, i) =>
            result + text + (randomRestaurantReward.variables[i] || ""),
          ""
        ),
      level: randomRestaurantReward.level,
    };

    if (customerLoyaltyForRestaurant) {
      customer = await User.findOneAndUpdate(
        { _id: req.user._id, "loyalties.restaurantId": restaurant._id },
        {
          $push: {
            "loyalties.$.rewards": newRandomReward,
          },
          $set: {
            "loyalties.$.numberOfTickets":
              customerLoyaltyForRestaurant.numberOfTickets -
              restaurant.numberOfTicketsForRedemption,
          },
        },
        { new: true }
      );
    }

    res.json(newRandomReward);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
