let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let restaurantSchema = new Schema({
  owner: {
    _id: {
      type: Schema.Types.ObjectId,
    },
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
  // Number of "dollar signs" to represent cost
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
});

mongoose.model("Restaurant", restaurantSchema);