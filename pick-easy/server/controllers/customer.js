let mongoose = require("mongoose");
let { validationResult } = require("express-validator");
let Restaurant = mongoose.model("Restaurant");
let User = mongoose.model("User");
let AchievementTemplate = mongoose.model("AchievementTemplate");
let RewardTemplate = mongoose.model("RewardTemplate");

// Function that checks if the request is invalid (due to the validation chain)
const isBadRequest = (req) => !validationResult(req).isEmpty();

/* Controller function that retrieves the customer information */
module.exports.retrieveCustomerById = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Find the customer and check if it exists
    let customer = await User.findById(req.params.id);
    if (!customer)
      return res.status(404).send(`Customer ${req.params.id} does not exist`);

    // Check if the customer's id matches the user requesting the information
    if (!customer._id.equals(req.user._id)) return res.status(401);

    // Only send back the customer's information without the hash and salt
    let customerWithoutPassword = (({ hash, salt, ...rest }) => rest)(
      customer.toJSON()
    );

    res.json(customerWithoutPassword);
  } catch (err) {
    res.sendStatus(500);
  }
};

/* Controller function to validate and create a new achievement */
module.exports.addAchievement = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Get requested user id and check if it exists
    let customer = await User.findById(req.params.userId);
    if (!customer)
      return res
        .status(404)
        .send(`Customer ${req.params.userId} does not exist`);

    // Check if the given customer id is the same as the user requesting
    if (!customer._id.equals(req.user._id)) return res.status(401);

    // Get requested restaurant and check if it exists
    let restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant)
      return res
        .status(404)
        .send(`Restaurant ${req.body.restaurantId} does not exist`);

    // Get the specific restaurant achievement and check if it exists
    let restaurantAchievement = restaurant.achievements.find((achievement) =>
      achievement._id.equals(req.body.restaurantAchievementId)
    );
    if (!restaurantAchievement)
      return res
        .status(404)
        .send(
          `Restaurant achievement ${req.body.restaurantAchievementId} does not exist`
        );

    // Construct a new achievement object
    let newAchievement = {
      restaurantAchievementId: restaurantAchievement._id,
      progress: 0,
      complete: false,
    };

    // Get customer loyalty for restaurant
    let loyalty = customer.loyalties.find((loyalty) =>
      loyalty.restaurantId.equals(restaurant._id)
    );

    // Check if loyalty is repeatable or not
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

      // Update database with new data
      customer = await User.findOneAndUpdate(
        { _id: req.user._id, "loyalties.restaurantId": restaurant._id },
        {
          $push: {
            "loyalties.$.achievements": newAchievement,
          },
        },
        { new: true }
      );
    } else {
      // Push new loyalty object with new achievement inside
      customer = await User.findByIdAndUpdate(
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

    // Send back the user object
    res.json(customer);
  } catch (err) {
    return res.sendStatus(500);
  }
};

/* Controller function that updates an achievement (progresses or completes) */
module.exports.updateAchievement = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Get requested user id and check if it exists
    let customer = await User.findById(req.params.userId);
    if (!customer)
      return res
        .status(404)
        .send(`Customer ${req.params.userId} does not exist`);

    // Get requested restaurant and check if it exists
    let restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant)
      return res
        .status(404)
        .send(`Restaurant ${req.body.restaurantId} does not exist`);

    // Get the specific restaurant achievement and check if it exists
    let restaurantAchievement = restaurant.achievements.find((achievement) =>
      achievement._id.equals(req.body.restaurantAchievementId)
    );
    if (!restaurantAchievement)
      return res
        .status(404)
        .send(
          `Restaurant achievement ${req.body.restaurantAchievementId} does not exist`
        );

    // Find the specific achievement template and check if it exists
    let achievementTemplate = await AchievementTemplate.findOne({
      templateNumber: restaurantAchievement.templateNumber,
    });
    if (!achievementTemplate)
      return res
        .status(404)
        .send(
          `Restaurant achievement template ${restaurantAchievement.templateNumber} does not exist`
        );

    // Get the specific variable index that determines the achievement templates progress
    let achievementTemplateVariableIndex = achievementTemplate.variables.findIndex(
      (variable) => variable.isProgressionVariable
    );

    // Function to add the scanned achievement to the restaurant log
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

    // Function to add the scanned achievement to the customer log
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

                // Add the achievement to the restaurant log
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

                // Add the achievement to the customer log
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
                // Add the achievement to the restaurant log
                await addToRestaurantLog(
                  restaurant,
                  customer,
                  achievementTemplate,
                  restaurantAchievement,
                  1,
                  1,
                  true
                );

                // Add the achievement to the customer log
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
              // Check if the given customer id is the same as the user requesting
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

            // Save the modified user object
            await customer.save();
            break;
          }
        }
      }
    }

    // Send status 200 OK
    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

/* Controller function that updates customer's level */
module.exports.updateLevel = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Get requested user id and check if it exists
    let customer = await User.findById(req.params.userId);
    if (!customer)
      return res
        .status(404)
        .send(`Customer ${req.params.userId} does not exist`);

    // Check if the given customer id is the same as the user requesting
    if (!customer._id.equals(req.user._id)) return res.status(401);

    // Get requested restaurant and check if it exists
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

    // Send status 200 OK
    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

/* Controller function that removes a customer's reward (because it has been redeemed) */
module.exports.removeReward = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Get requested user id and check if it exists
    let customer = await User.findById(req.params.userId);
    if (!customer)
      return res
        .status(404)
        .send(`Customer ${req.params.userId} does not exist`);

    // Get requested restaurant and check if it exists
    let restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant)
      return res
        .status(404)
        .send(`Restaurant ${req.body.restaurantId} does not exist`);

    if (!restaurant.staff._id.equals(req.user._id)) return res.status(401);

    // Get customer loyalty for restaurant and check if it exists
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

    // Send status 200 OK
    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

/* Controller function that generated a random reward for a customer */
module.exports.generateReward = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Get requested user id and check if it exists
    let customer = await User.findById(req.params.userId);
    if (!customer)
      return res.status(404).send(`User ${req.params.userId} does not exist`);

    // Check if the given customer id is the same as the user requesting
    if (!customer._id.equals(req.user._id)) return res.status(401);

    // Get requested restaurant and check if it exists
    let restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant)
      return res
        .status(404)
        .send(`Restaurant ${req.body.restaurantId} does not exist`);

    // Get customer loyalty for restaurant and check if it exists
    let customerLoyaltyForRestaurant = customer.loyalties.find((loyalty) =>
      restaurant._id.equals(loyalty.restaurantId)
    );
    if (!customerLoyaltyForRestaurant)
      return res
        .status(404)
        .send(
          `Customer loyalty for restaurant ${req.body.restaurantId} does not exist`
        );

    // Check if customer has enough tickets to roll for a reward
    if (
      customerLoyaltyForRestaurant.numberOfTickets <
      restaurant.numberOfTicketsForRedemption
    )
      return res.status(409).send(`Not enough tickets to roll for reward`);

    // Function that gets the levels under a given level
    let getLevelsUnder = (level) => {
      let levels = [];
      const bronze = level == "Bronze";
      const silver = level == "Silver";
      const gold = level == "Gold";
      const platinum = level == "Platinum";
      const diamond = level == "Diamond";
      if (bronze || silver || gold || platinum || diamond)
        levels.push("Bronze");
      if (silver || gold || platinum || diamond) levels.push("Silver");
      if (gold || platinum || diamond) levels.push("Gold");
      if (platinum || diamond) levels.push("Platinum");
      if (diamond) levels.push("Diamond");
      return levels;
    };

    // Function that calculates the new weight using the possible levels
    let calculateNewWeight = (level, customerLevel, rewardWeight) => {
      let total = 0;
      let levels = getLevelsUnder(customerLevel);
      for (let i = 0; i < levels.length; i++) {
        total += rewardWeight[levels[i].toLowerCase()];
      }
      if (total == 0) return 0;
      return rewardWeight[level.toLowerCase()] / total;
    };

    // Function that gets a random level out the given levels and probabilities
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

    // Constants to check if the customer is a certain level
    const bronzeLoyalty = customerLoyaltyForRestaurant.level == "Bronze";
    const silverLoyalty = customerLoyaltyForRestaurant.level == "Silver";
    const goldLoyalty = customerLoyaltyForRestaurant.level == "Gold";
    const platinumLoyalty = customerLoyaltyForRestaurant.level == "Platinum";
    const diamondLoyalty = customerLoyaltyForRestaurant.level == "Diamond";

    // Filter the restaurant rewards that the customer is able to roll
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

    // List of levels the customer is able to get a reward from
    let allowedLevels = Array.from(
      new Set(
        allowedRestaurantRewards.map(
          (allowedRestaurantReward) => allowedRestaurantReward.level
        )
      )
    );

    // List of weights that corresponds 1-1 to the allowed levels
    let allowedWeights = allowedLevels.map((level) =>
      calculateNewWeight(
        level,
        customerLoyaltyForRestaurant.level,
        restaurant.rewardWeight
      )
    );

    let randomLevel = getRandomLevel(allowedWeights, allowedLevels);

    // Filter the allowed random rewards from the list of rewards given the random level
    let allowedRandomRewards = restaurant.rewards.filter(
      (reward) => reward.level == randomLevel
    );

    // Get a random reward out of the list of allowed random rewards
    let randomRewardIndex = Math.floor(
      Math.random() * allowedRandomRewards.length
    );
    let randomRestaurantReward = allowedRandomRewards[randomRewardIndex];

    // Get the reward template given the random reward's template number and check if it exists
    let rewardTemplate = await RewardTemplate.findOne({
      templateNumber: randomRestaurantReward.templateNumber,
    });
    if (!rewardTemplate)
      return res
        .status(404)
        .send(
          `Restaurant rewards template ${randomRestaurantReward.templateNumber} does not exist`
        );

    // Construct the new random reward object
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

    // Update database with new reward
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

    // Send back the user object
    res.json(newRandomReward);
  } catch (err) {
    return res.sendStatus(500);
  }
};
