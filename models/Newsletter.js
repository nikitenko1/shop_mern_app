const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Newsletter = mongoose.model('newsletter', newsletterSchema);
module.exports = Newsletter;
