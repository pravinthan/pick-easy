let express = require("express");
let router = express.Router();
let { body } = require("express-validator");
let jwt = require("express-jwt");

let auth = jwt({ secret: process.env.JWT_SECRET });

let authenticationController = require("../controllers/authentication");

// Authentication
router.post(
  "/users/signup",
  [
    body("firstName").trim().isAlpha().isLength({ min: 1, max: 20 }).escape(),
    body("lastName").trim().isAlpha().isLength({ min: 1, max: 20 }).escape(),
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

// // Restaurants
// router.get("/restaurants", auth, projectController.retrieveAllRestaurants);
// router.get(
//   "/restaurants/:id",
//   auth,
//   [
//     param("id")
//       .exists({ checkNull: true, checkFalsy: true })
//       .trim()
//       .isMongoId()
//       .escape(),
//   ],
//   projectController.retrieveRestaurantById
// );

module.exports = router;
