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
  rating: {
    value: {
      type: Number,
      min: 0,
      max: 5,
    },
    ratedBy: {
      type: Number,
      min: 0,
    },
  },
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
  numberOfTicketsForReward: {
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
    },
  ],
});

mongoose.model("Restaurant", restaurantSchema);
