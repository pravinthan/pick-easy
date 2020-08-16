let mongoose = require("mongoose");
let { validationResult } = require("express-validator");
let Restaurant = mongoose.model("Restaurant");
let User = mongoose.model("User");
let AchievementTemplate = mongoose.model("AchievementTemplate");
let RewardTemplate = mongoose.model("RewardTemplate");
let aws = require("aws-sdk");

// Update AWS config object with secret credentials
aws.config.update({
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  region: process.env.S3_BUCKET_REGION,
});
let s3 = new aws.S3();

// Function that checks if the request is invalid (due to the validation chain)
const isBadRequest = (req) => !validationResult(req).isEmpty();

/* Controller function that creates a new restaurant */
module.exports.createRestaurant = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  // Create the restaurant with the given values
  let restaurant;
  try {
    restaurant = await Restaurant.create({
      staff: { _id: req.user._id },
      name: req.body.restaurantName,
      description: req.body.restaurantDescription,
      cost: req.body.restaurantCost,
      cuisine: req.body.restaurantCuisine,
      image: req.file,
      rewardWeight: {
        bronze: 100,
        silver: 0,
        gold: 0,
        platinum: 0,
        diamond: 0,
      },
      log: {
        achievements: [],
        rewards: [],
      },
    });

    // Update the restaurant staff's object by setting that they created a restaurant
    await User.findByIdAndUpdate(req.user._id, {
      $set: { createdRestaurant: true },
    });

    // Send the new restaurant object as a response
    res.json(restaurant);
  } catch (err) {
    return res.sendStatus(500);
  }
};

/* Controller function that gets restaurant by its id */
module.exports.retrieveRestaurantById = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Find the restaurant given its id and check if it exists
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    // Send the restaurant object as a response
    res.json(restaurant);
  } catch (err) {
    res.sendStatus(500);
  }
};

/* Controller function that all restaurants */
module.exports.retrieveAllRestaurants = async (req, res) => {
  try {
    // Send all the restaurant objects as a response
    res.json(await Restaurant.find({}));
  } catch (err) {
    res.sendStatus(500);
  }
};

/* Controller function that gets a restaurant staff's restaurant */
module.exports.retrieveOwnRestaurant = async (req, res) => {
  try {
    // Find the restaurant given the staff's id and check if it exists
    let restaurant = await Restaurant.findOne({ "staff._id": req.user._id });
    if (!restaurant)
      return res.status(404).send(`No restaurant found under the user`);

    // Send the restaurant object as a response
    res.json(restaurant);
  } catch (err) {
    res.sendStatus(500);
  }
};

/* Controller function that updates a restaurant's achievements */
module.exports.updateAchievements = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  for (const achievement of req.body.achievements) {
    // Get the template given the achievement's template number
    let template = await AchievementTemplate.findOne({
      templateNumber: achievement.templateNumber,
    });

    // Check if it exists, check if the template variables match the length of the achievement variables,
    // and check if the achievement's template number matches the template's number
    if (
      !template ||
      template.variables.length != achievement.variables.length ||
      (!template.repeatable &&
        req.body.achievements.filter(
          (achievement) => achievement.templateNumber == template.templateNumber
        ).length > 1)
    ) {
      return res.sendStatus(400);
    }
  }

  try {
    // Find the restaurant given its id and check if it exists
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    // Check if the restaurant staff's id matches the user who is sending the request
    if (!restaurant.staff._id.equals(req.user._id)) return res.sendStatus(403);

    // Update the restaurant object with the given achievements and number of tickets for redemption
    await Restaurant.findByIdAndUpdate(restaurant._id, {
      $set: {
        numberOfTicketsForRedemption: req.body.numberOfTicketsForRedemption,
        achievements: req.body.achievements,
      },
    });

    // Send status 200 OK
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

/* Controller function that updates a restaurant's rewards */
module.exports.updateRewards = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  for (const reward of req.body.rewards) {
    // Get the reward template using the reward's template number
    let template = await RewardTemplate.findOne({
      templateNumber: reward.templateNumber,
    });

    // Check if it exists and if the reward's variables match the length of the template variables
    if (!template || template.variables.length != reward.variables.length) {
      return res.sendStatus(400);
    }
  }

  try {
    // Find the restaurant given its id and check if it exists
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    // Check if the restaurant staff's id matches the user who is sending the request
    if (!restaurant.staff._id.equals(req.user._id)) return res.sendStatus(403);

    // Update the restaurant with the new rewards
    await Restaurant.findByIdAndUpdate(restaurant._id, {
      $set: { rewards: req.body.rewards },
    });

    // Send status 200 OK
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

/* Controller function that updates a restaurant with new values */
module.exports.updateRestaurant = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Find the restaurant given its id and check if it exists
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    // Check if the restaurant staff's id matches the user who is sending the request
    if (!restaurant.staff._id.equals(req.user._id)) return res.sendStatus(403);

    // Construct the updated restaurant object
    let updatedRestaurantValues = {
      name: req.body.restaurantName,
      description: req.body.restaurantDescription,
      cost: req.body.restaurantCost,
      cuisine: req.body.restaurantCuisine,
    };

    // Update the restaurant with its new values
    if (req.file) {
      await Restaurant.findByIdAndUpdate(restaurant._id, {
        $set: {
          ...updatedRestaurantValues,
          image: req.file,
        },
      });
    } else {
      await Restaurant.findByIdAndUpdate(restaurant._id, {
        $set: updatedRestaurantValues,
      });
    }

    // Send status 200 OK
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

/* Controller function that updates a restaurant's reward weights */
module.exports.updateRestaurantRewardWeight = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Find the restaurant given its id and check if it exists
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    // Check if the restaurant staff's id matches the user who is sending the request
    if (!restaurant.staff._id.equals(req.user._id)) return res.sendStatus(403);

    // Check if the reward weight adds up to 100
    const rewardWeight = req.body.rewardWeight;
    if (
      rewardWeight.bronze +
        rewardWeight.silver +
        rewardWeight.gold +
        rewardWeight.platinum +
        rewardWeight.diamond !=
      100
    )
      return res.status(400).send("Reward weight should add up to 100%");

    // Update the restaurant with the new reward weights
    await Restaurant.findByIdAndUpdate(restaurant._id, {
      $set: { rewardWeight },
    });

    // Send status 200 OK
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

/* Controller function that retrieves a restaurant's image */
module.exports.retrieveRestaurantImage = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Find the restaurant given its id and check if it exists
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    // Check if the image exists
    if (!restaurant.image)
      return res
        .status(404)
        .send(`Restaurant image for ${req.params.id} does not exist`);

    // Send the image
    res.setHeader("Content-Type", restaurant.image.mimetype);
    const image = await s3
      .getObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: restaurant.staff._id.toString(),
      })
      .promise();
    return res.send(image.Body);
  } catch (err) {
    res.sendStatus(500);
  }
};
