let mongoose = require("mongoose");
let { validationResult } = require("express-validator");
let Restaurant = mongoose.model("Restaurant");
let User = mongoose.model("User");
let AchievementTemplate = mongoose.model("AchievementTemplate");
let RewardTemplate = mongoose.model("RewardTemplate");
let aws = require("aws-sdk");
aws.config.update({
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  region: process.env.S3_BUCKET_REGION,
});
let s3 = new aws.S3();

const isBadRequest = (req) => !validationResult(req).isEmpty();

module.exports.createRestaurant = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  let restaurant;
  try {
    restaurant = await Restaurant.create({
      staff: { _id: req.user._id },
      name: req.body.restaurantName,
      description: req.body.restaurantDescription,
      cost: req.body.restaurantCost,
      cuisine: req.body.restaurantCuisine,
      image: req.file,
      log: {
        achievements: [],
        rewards: [],
      },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $set: { createdRestaurant: true },
    });

    res.json(restaurant);
  } catch (err) {
    return res.sendStatus(500);
  }
};

module.exports.retrieveRestaurantById = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    res.json(restaurant);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports.retrieveAllRestaurants = async (req, res) => {
  try {
    res.json(await Restaurant.find({}));
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports.retrieveOwnRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne({ "staff._id": req.user._id });

    if (!restaurant)
      return res.status(404).send(`No restaurant found under the user`);

    res.json(restaurant);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports.updateAchievements = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  for (const achievement of req.body.achievements) {
    let template = await AchievementTemplate.findOne({
      templateNumber: achievement.templateNumber,
    });

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
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    if (!restaurant.staff._id.equals(req.user._id)) return res.sendStatus(403);

    await Restaurant.findByIdAndUpdate(restaurant._id, {
      $set: {
        numberOfTicketsForRedemption: req.body.numberOfTicketsForRedemption,
        achievements: req.body.achievements,
      },
    });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports.updateRewards = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  for (const reward of req.body.rewards) {
    let template = await RewardTemplate.findOne({
      templateNumber: reward.templateNumber,
    });

    if (!template || template.variables.length != reward.variables.length) {
      return res.sendStatus(400);
    }
  }

  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    if (!restaurant.staff._id.equals(req.user._id)) return res.sendStatus(403);

    await Restaurant.findByIdAndUpdate(restaurant._id, {
      $set: { rewards: req.body.rewards },
    });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports.updateRestaurant = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    if (!restaurant.staff._id.equals(req.user._id)) return res.sendStatus(403);

    let updatedRestaurantValues = {
      name: req.body.restaurantName,
      description: req.body.restaurantDescription,
      cost: req.body.restaurantCost,
      cuisine: req.body.restaurantCuisine,
    };

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

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports.retrieveRestaurantImage = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant)
      return res.status(404).send(`Restaurant ${req.params.id} does not exist`);

    if (!restaurant.image)
      return res
        .status(404)
        .send(`Restaurant image for ${req.params.id} does not exist`);

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
