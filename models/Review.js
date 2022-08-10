const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'product',
    },
    star: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    like: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Review = mongoose.model('review', reviewSchema);
module.exports = Review;
