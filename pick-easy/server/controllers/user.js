let mongoose = require("mongoose");
let { validationResult } = require("express-validator");
let User = mongoose.model("User");

// Function that checks if the request is invalid (due to the validation chain)
const isBadRequest = (req) => !validationResult(req).isEmpty();

/* Controller function that retrieves the user information */
module.exports.retrieveUserById = async (req, res) => {
  if (isBadRequest(req)) return res.sendStatus(400);

  try {
    // Find the user and check if it exists
    let user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).send(`User ${req.params.id} does not exist`);

    // Check if the user's id matches the user requesting the information
    if (!user._id.equals(req.user._id)) return res.status(401);

    // Only send back the user's information without the hash and salt
    let userWithoutPassword = (({ hash, salt, ...rest }) => rest)(
      user.toJSON()
    );
    res.json(userWithoutPassword);
  } catch (err) {
    res.sendStatus(500);
  }
};
