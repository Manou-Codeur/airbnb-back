const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TypePlace",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pricing: {
    perDay: Number,
  },
  images: [String],
  capacity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: 20,
    maxLength: 300,
  },
  rating: [
    {
      userId: String,
      rate: Number,
    },
  ],
  address: {
    country: String,
    city: String,
    street: String,
    zipCode: {
      type: Number,
      maxLength: 5,
      minLength: 5,
    },
    gps: {
      lat: Number,
      long: Number,
    },
  },
});

module.exports = mongoose.model("Place", placeSchema);
