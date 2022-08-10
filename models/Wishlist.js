const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Wishlist = mongoose.model('wishlist', wishlistSchema);
module.exports = Wishlist;
