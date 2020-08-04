let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let restaurantSchema = new Schema({
  staff: {
    _id: {
      type: Schema.Types.ObjectId,
    },
  },
  image: {
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    size: String,
    isMain: Boolean,
  },
  name: String,
  description: String,
  cost: {
    type: Number,
    min: 1,
    max: 4,
  },
  cuisine: {
    type: String,
    enum: [
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
    ],
  },
  numberOfTicketsForRedemption: {
    type: Number,
    min: 1,
    default: 1,
  },
  achievements: [
    {
      templateNumber: Number,
      variables: [String],
      numberOfTickets: {
        type: Number,
        min: 1,
      },
    },
  ],
  rewards: [
    {
      templateNumber: Number,
      variables: [String],
      level: {
        type: String,
        enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
      },
    },
  ],
  rewardWeight: {
    bronze: {
      type: Number,
      min: 0,
      max: 100,
    },
    silver: {
      type: Number,
      min: 0,
      max: 100,
    },
    gold: {
      type: Number,
      min: 0,
      max: 100,
    },
    platinum: {
      type: Number,
      min: 0,
      max: 100,
    },
    diamond: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  log: {
    achievements: [
      {
        customerId: {
          type: Schema.Types.ObjectId,
        },
        customerName: String,
        achievement: String,
        progress: String,
        complete: Boolean,
        timeOfScan: Date,
      },
    ],
    rewards: [
      {
        customerId: {
          type: Schema.Types.ObjectId,
        },
        customerName: String,
        reward: String,
        level: {
          type: String,
          enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
        },
        timeOfScan: Date,
      },
    ],
  },
});

mongoose.model("Restaurant", restaurantSchema);
