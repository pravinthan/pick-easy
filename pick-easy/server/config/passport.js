let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let mongoose = require("mongoose");
let User = mongoose.model("User");

passport.use(
  new LocalStrategy({}, (username, password, done) => {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) return done(null, false, "User was not found");
        if (!user.isValidPassword(password))
          return done(null, false, "Password was incorrect");

        return done(null, user);
      })
      .catch((err) => done(err));
  })
);
