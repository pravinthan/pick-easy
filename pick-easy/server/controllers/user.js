let mongoose = require("mongoose");
let { validationResult } = require("express-validator");
let User = mongoose.model("User");

const isBadRequest = (req) => !validationResult(req).isEmpty();

module.exports.retrieveUserById = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    let user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).send(`User ${req.params.id} does not exist`);

    if (!req.user._id.equals(user._id)) return res.status(401);

    let userWithoutPassword = (({ hash, salt, ...rest }) => rest)(user);
    res.json(userWithoutPassword);
  } catch (err) {
    res.sendStatus(500);
  }
};
