let express = require("express");
let router = express.Router();
let { body, param } = require("express-validator");
let jwt = require("express-jwt");

let auth = jwt({ secret: process.env.JWT_SECRET });

let restaurantOwnerAuth = (req, res, next) => {
  if (!req.user.isRestaurantOwner)
    return res.status(403).send("User is not a restaurant owner");

  next();
};

let customerAuth = (req, res, next) => {
  if (req.user.isRestaurantOwner)
    return res.status(403).send("User is not a customer");

  next();
};

let authenticationController = require("../controllers/authentication");
let userController = require("../controllers/user");
let restaurantController = require("../controllers/restaurant");
let achievementTemplateController = require("../controllers/achievement-template");

// Authentication
router.post(
  "/users/signup",
  [
    body("firstName").trim().isAlpha().isLength({ min: 1, max: 20 }).escape(),
    body("lastName").trim().isAlpha().isLength({ min: 1, max: 20 }).escape(),
    body("isRestaurantOwner").isBoolean().escape(),
    body("username")
      .trim()
      .isAlphanumeric()
      .isLength({ min: 3, max: 20 })
      .escape(),
    body("password").trim().isLength({ min: 8, max: 20 }).escape(),
  ],
  authenticationController.signUp
);
router.post(
  "/users/signin",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .isAlphanumeric()
      .escape(),
    body("password").trim().isLength({ min: 8, max: 20 }).escape(),
  ],
  authenticationController.signIn
);

// Users
router.get(
  "/users/:id",
  auth,
  [
    param("id")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
  ],
  userController.retrieveUserById
);

// Restaurants
router.post("/restaurants", auth, restaurantController.createRestaurant);
router.get("/restaurants", auth, restaurantController.retrieveAllRestaurants);
router.get(
  "/restaurants/owned",
  auth,
  restaurantOwnerAuth,
  restaurantController.retrieveOwnRestaurant
);
router.get(
  "/restaurants/:id",
  auth,
  [
    param("id")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
  ],
  restaurantController.retrieveRestaurantById
);
router.patch(
  "/restaurants/:id",
  auth,
  restaurantOwnerAuth,
  [
    param("id")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("numberOfTicketsForReward")
      .exists({ checkNull: true })
      .isInt({ min: 1 }),
    body("achievements")
      .exists({ checkNull: true, checkFalsy: true })
      .isArray(),
    body("achievements.*.templateNumber")
      .exists({ checkNull: true })
      .isInt({ min: 0 }),
    body("achievements.*.numberOfTickets")
      .exists({ checkNull: true })
      .isInt({ min: 1 }),
    body("achievements.*.variables").isArray(),
    body("achievements.*.variables.*")
      .if(body("achievements.*.variables.*").isString())
      .trim()
      .escape(),
    body("achievements.*.variables.*")
      .if(body("achievements.*.variables.*").isInt())
      .isInt({ min: 0 }),
  ],
  restaurantController.updateAchievements
);

// Achievement Templates
router.get(
  "/templates/achievements",
  auth,
  restaurantOwnerAuth,
  achievementTemplateController.retrieveAllTemplates
);

module.exports = router;
