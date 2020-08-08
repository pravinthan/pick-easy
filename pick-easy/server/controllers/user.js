let passport = require("passport");
let { validationResult } = require("express-validator");
let mongoose = require("mongoose");
let User = mongoose.model("User");

/* Controller function to validate and create a new user */
module.exports.signUp = (req, res) => {
  if (validationResult(req).array().length > 0) return res.sendStatus(400);

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user)
        return res
          .status(409)
          .send(`Username ${req.body.username} already exists`);

      let newUser = new User();
      newUser.firstName = req.body.firstName;
      newUser.lastName = req.body.lastName;
      newUser.username = req.body.username;
      newUser.isRestaurantStaff = req.body.isRestaurantStaff;
      newUser.setPassword(req.body.password);

      newUser.save((err) => res.json({ token: newUser.generateJWT() }));
    })
    .catch((err) => res.sendStatus(500));
};

/* Controller function to validate and send a JWT (i.e. sign in) */
module.exports.signIn = (req, res) => {
  if (validationResult(req).array().length > 0) return res.sendStatus(400);

  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send(info);

    res.json({ token: user.generateJWT() });
  })(req, res);
};

/* Controller function to send a JWT assuming their JWT is old */
module.exports.retrieveNewJWT = (req, res) => {
  User.findOne({ username: req.user.username })
    .then((user) => res.json({ token: user.generateJWT() }))
    .catch((err) => res.sendStatus(500));
};
