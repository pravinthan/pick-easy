let mongoose = require("mongoose");
let { validationResult } = require("express-validator");
let Restaurant = mongoose.model("Restaurant");

const isBadRequest = (req) => !validationResult(req).isEmpty();

module.exports.createRestaurant = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  let restaurant;
  try {
    restaurant = await Restaurant.create({
      owner: { _id: req.user._id },
      name: req.body.description,
      rating: { value: 0, ratedBy: 0 },
      cost: req.body.cost,
      cuisine: req.body.cuisine,
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
