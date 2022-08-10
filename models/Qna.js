const mongoose = require('mongoose');

const qnaSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    reply: {
      type: mongoose.Types.ObjectId,
      ref: 'qna',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'product',
    },
    likes: [
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
const Qna = mongoose.model('qna', qnaSchema);
module.exports = Qna;
