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
  isRestaurantStaff: {
    type: Boolean,
    default: false,
  },
  createdRestaurant: {
    type: Boolean,
    default: false,
  },
  log: {
    achievements: [
      {
        restaurantId: {
          type: Schema.Types.ObjectId,
        },
        restaurantName: String,
        achievement: String,
        progress: String,
        complete: Boolean,
        timeOfScan: Date,
      },
    ],
    rewards: [
      {
        restaurantId: {
          type: Schema.Types.ObjectId,
        },
        restaurantName: String,
        reward: String,
        level: {
          type: String,
          enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
        },
        timeOfScan: Date,
      },
    ],
  },
  loyalties: [
    {
      restaurantId: {
        type: Schema.Types.ObjectId,
      },
      numberOfTickets: {
        type: Number,
        min: 0,
      },
      level: {
        type: String,
        enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
      },
      achievements: [
        {
          restaurantAchievementId: {
            type: Schema.Types.ObjectId,
          },
          progress: {
            type: Number,
            min: 0,
          },
          complete: Boolean,
        },
      ],
      completedNonRepeatableAchievements: [
        {
          restaurantAchievementId: {
            type: Schema.Types.ObjectId,
          },
        },
      ],
      rewards: [
        {
          content: String,
          level: {
            type: String,
            enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
          },
        },
      ],
    },
  ],
  hash: String,
  salt: String,
});

// Function that sets the password (using salt and hash)
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

// Function that checks if the password is valid by comparing the hashes
userSchema.methods.isValidPassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

// Function that generates a new JWT
userSchema.methods.generateJWT = function () {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      isRestaurantStaff: this.isRestaurantStaff,
      createdRestaurant: this.createdRestaurant,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.JWT_SECRET
  );
};

mongoose.model("User", userSchema);
