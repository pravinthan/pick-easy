let express = require("express");
let router = express.Router();
let { body, param } = require("express-validator");
let jwt = require("express-jwt");

let auth = jwt({ secret: process.env.JWT_SECRET });

let multer = require("multer");
let multerS3 = require("multer-s3");
let aws = require("aws-sdk");
aws.config.update({
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  region: process.env.S3_BUCKET_REGION,
});
let s3 = new aws.S3();
const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg")
    callback(null, true);
  else callback(null, false);
};
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
router.post(
  "/restaurants",
  auth,
  restaurantOwnerAuth,
  upload.single("restaurantImage"),
  [
    body("restaurantName")
      .trim()
      .isLength({ min: 1, max: 30 })
      .isAlphanumeric()
      .escape(),
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
  upload.single("restaurantImage"),
  [
    param("id")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("restaurantName")
      .trim()
      .isLength({ min: 1, max: 30 })
      .isAlphanumeric()
      .escape(),
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

router.get(
  "/restaurants/:id/image",
  auth,
  restaurantController.retrieveRestaurantImage
);

router.patch(
  "/restaurants/:id/achievements",
  auth,
  restaurantOwnerAuth,
  [
    param("id")
      .exists({ checkNull: true, checkFalsy: true })
      .trim()
      .isMongoId()
      .escape(),
    body("numberOfStampsForReward")
      .exists({ checkNull: true })
      .isInt({ min: 1 }),
    body("achievements")
      .exists({ checkNull: true, checkFalsy: true })
      .isArray(),
    body("achievements.*.templateNumber")
      .exists({ checkNull: true })
      .isInt({ min: 0 }),
    body("achievements.*.numberOfStamps")
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
