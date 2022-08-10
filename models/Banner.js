const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'product',
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('banner', bannerSchema);

module.exports = Banner;
