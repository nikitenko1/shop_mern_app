const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
const Subscriber = mongoose.model('subscriber', subscriberSchema);
module.exports = Subscriber;
