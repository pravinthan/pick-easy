let mongoose = require("mongoose");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  isRestaurantOwner: {
    type: Boolean,
    default: false,
  },
  loyalties: [
    {
      restaurantId: {
        type: Schema.Types.ObjectId,
      },
      progress: {
        type: Number,
        min: 0,
      },
    }
  ],
  hash: String,
  salt: String,
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.isValidPassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.generateJWT = function () {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.JWT_SECRET
  );
};

mongoose.model("User", userSchema);
