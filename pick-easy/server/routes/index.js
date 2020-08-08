let express = require("express");
let router = express.Router();
let { body, param } = require("express-validator");
let jwt = require("express-jwt");
let multer = require("multer");
let multerS3 = require("multer-s3");
let aws = require("aws-sdk");

// Update AWS config object with secret credentials
aws.config.update({
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  region: process.env.S3_BUCKET_REGION,
});
let s3 = new aws.S3();

// Function that is called to verify if the restaurant image are png/jpg only
const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg")
    callback(null, true);
  else callback(null, false);
};

// Multer upload object that uploads images to the cloud (AWS S3)
let upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, req.user._id);
    },
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 },
});

// Authentication middleware
let auth = jwt({ secret: process.env.JWT_SECRET });

// Restaurant staff authentication middleware
let restaurantStaffAuth = (req, res, next) => {
  if (!req.user.isRestaurantStaff)
    return res.status(403).send("User is not a restaurant staff");

  next();
};

// Customer authentication middleware
let customerAuth = (req, res, next) => {
  if (req.user.isRestaurantStaff)
    return res.status(403).send("User is not a customer");

  next();
};

let userController = require("../controllers/user");
let restaurantController = require("../controllers/restaurant");
let customerController = require("../controllers/customer");
let achievementTemplateController = require("../controllers/achievement-template");
let rewardTemplateController = require("../controllers/reward-template");

/*********************************** Users API endpoints ***********************************/
// Sign Up endpoint
router.post(
  "/users/signup",
  [
    body("firstName").trim().isAlpha().isLength({ min: 1, max: 20 }).escape(),
    body("lastName").trim().isAlpha().isLength({ min: 1, max: 20 }).escape(),
    body("isRestaurantStaff").toBoolean(true),
    body("username")
      .trim()
      .isAlphanumeric()
      .isLength({ min: 3, max: 20 })
      .escape(),
    body("password").trim().isLength({ min: 8, max: 20 }).escape(),
  ],
  userController.signUp
);

// Sign In endpoint
router.post(
  "/users/signin",
  [
    body("isRestaurantStaff").toBoolean(true),
    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .isAlphanumeric()
      .escape(),
    body("password").trim().isLength({ min: 8, max: 20 }).escape(),
  ],
  userController.signIn
);

// Retrieve New JWT endpoint
router.get("/users/retrieve-new-jwt", auth, userController.retrieveNewJWT);

/*********************************** Restaurants API endpoints ***********************************/
// Create Restaurant endpoint
router.post(
  "/restaurants",
  auth,
  restaurantStaffAuth,
  upload.single("restaurantImage"),
  [
    body("restaurantName").trim().isLength({ min: 1, max: 30 }).escape(),
    body("restaurantDescription")
      .trim()
      .isLength({ min: 1, max: 250 })
      .escape(),
    body("restaurantCost")
      .exists({ checkNull: true })
      .toInt()
      .isInt({ min: 1, max: 4 }),
    body("restaurantCuisine").isIn([
      "Mexican",
      "Italian",
      "American",
      "Thai",
      "Japanese",
      "Chinese",
      "Indian",
      "French",
      "Brazilian",
      "Greek",
      "Korean",
    ]),
  ],
  restaurantController.createRestaurant
);

// Get All Restaurants endpoint
router.get("/restaurants", auth, restaurantController.retrieveAllRestaurants);

// Get Restaurant Staff's Own Restaurant endpoint
router.get(
  "/restaurants/owned",
  auth,
  restaurantStaffAuth,
  restaurantController.retrieveOwnRestaurant
);

// Get Restaurant by ID endpoint
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

// Update Restaurant's Information endpoint
router.patch(
  "/restaurants/:id",
  auth,
  restaurantStaffAuth,
  upload.single("restaurantImage"),
  [
    param("id")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("restaurantName").trim().isLength({ min: 1, max: 30 }).escape(),
    body("restaurantDescription")
      .trim()
      .isLength({ min: 1, max: 250 })
      .escape(),
    body("restaurantCost")
      .exists({ checkNull: true })
      .toInt()
      .isInt({ min: 1, max: 4 }),
    body("restaurantCuisine").isIn([
      "Mexican",
      "Italian",
      "American",
      "Thai",
      "Japanese",
      "Chinese",
      "Indian",
      "French",
      "Brazilian",
      "Greek",
      "Korean",
    ]),
  ],
  restaurantController.updateRestaurant
);

// Update Restaurant's Reward Weights endpoint
router.patch(
  "/restaurants/:id/rewardWeight",
  auth,
  restaurantStaffAuth,
  [
    param("id")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("rewardWeight").exists({ checkNull: true, checkFalsy: true }),
    body("rewardWeight.bronze")
      .exists({ checkNull: true })
      .toInt()
      .isInt({ min: 0, max: 100 }),
    body("rewardWeight.silver")
      .exists({ checkNull: true })
      .toInt()
      .isInt({ min: 0, max: 100 }),
    body("rewardWeight.gold")
      .exists({ checkNull: true })
      .toInt()
      .isInt({ min: 0, max: 100 }),
    body("rewardWeight.platinum")
      .exists({ checkNull: true })
      .toInt()
      .isInt({ min: 0, max: 100 }),
    body("rewardWeight.diamond")
      .exists({ checkNull: true })
      .toInt()
      .isInt({ min: 0, max: 100 }),
  ],
  restaurantController.updateRestaurantRewardWeight
);

// Update Restaurant's Image endpoint
router.get(
  "/restaurants/:id/image",
  auth,
  restaurantController.retrieveRestaurantImage
);

// Update Restaurant's Achievements endpoint
router.patch(
  "/restaurants/:id/achievements",
  auth,
  restaurantStaffAuth,
  [
    param("id")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("numberOfTicketsForRedemption")
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

// Update Restaurant's Rewards endpoint
router.patch(
  "/restaurants/:id/rewards",
  auth,
  restaurantStaffAuth,
  [
    param("id")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("rewards").exists({ checkNull: true, checkFalsy: true }).isArray(),
    body("rewards.*.templateNumber")
      .exists({ checkNull: true })
      .isInt({ min: 0 }),
    body("rewards.*.level").isIn([
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
    ]),
    body("rewards.*.variables").isArray(),
    body("rewards.*.variables.*")
      .if(body("rewards.*.variables.*").isString())
      .trim()
      .escape(),
    body("rewards.*.variables.*")
      .if(body("rewards.*.variables.*").isInt())
      .isInt({ min: 0 }),
  ],
  restaurantController.updateRewards
);

/*********************************** Achievement Templates API endpoints ***********************************/
router.get(
  "/templates/achievements",
  auth,
  achievementTemplateController.retrieveAllTemplates
);

/*********************************** Reward Templates API endpoints ***********************************/
router.get(
  "/templates/rewards",
  auth,
  rewardTemplateController.retrieveAllTemplates
);

/*********************************** Customer API endpoints ***********************************/
// Get Customer Information endpoint
router.get(
  "/customers/:id",
  auth,
  [
    param("id")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
  ],
  customerController.retrieveCustomerById
);

// Create Customer Achievement endpoint
router.post(
  "/customers/:userId/achievements",
  auth,
  customerAuth,
  [
    param("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("restaurantId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("restaurantAchievementId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
  ],
  customerController.addAchievement
);

// Update Customer Achievement endpoint
router.patch(
  "/customers/:userId/achievements",
  auth,
  // If operation is 'progress', then use restaurantStaffAuth. If operation is 'redeem', then use customerAuth.
  (req, res, next) => {
    if (req.body.operation == "progress")
      return restaurantStaffAuth(req, res, next);
    else if (req.body.operation == "redeem")
      return customerAuth(req, res, next);
    else return res.sendStatus(400);
  },
  [
    param("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("restaurantId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("restaurantAchievementId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("operation").isIn(["progress", "redeem"]),
  ],
  customerController.updateAchievement
);

// Create Customer Level endpoint
router.patch(
  "/customers/:userId/level",
  auth,
  customerAuth,
  [
    param("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("restaurantId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
  ],
  customerController.updateLevel
);

// Create Customer Reward endpoint
router.post(
  "/customers/:userId/rewards",
  auth,
  customerAuth,
  [
    param("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("restaurantId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
  ],
  customerController.generateReward
);

// Update Customer Reward endpoint
router.patch(
  "/customers/:userId/rewards",
  auth,
  restaurantStaffAuth,
  [
    param("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("restaurantId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("customerRewardId")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
  ],
  customerController.removeReward
);

module.exports = router;
