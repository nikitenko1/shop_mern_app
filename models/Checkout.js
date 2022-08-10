const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    recipientName: {
      type: String,
      required: true,
    },
    recipientPhone: {
      type: String,
      required: true,
    },
    recipientEmail: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    expedition: {
      type: String,
      required: true,
    },
    // expeditionService: {
    //   type: String,
    //   required: true,
    // },
    // expeditionFee: {
    //   type: Number,
    //   required: true,
    // },
    // estimatedDay: {
    //   type: String,
    //   required: true,
    // },
    payPhoneNumber: {
      type: String,
    },
    discount: {
      code: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
    items: [
      {
        qty: Number,
        color: String,
        size: Number,
        discount: Number,
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'product',
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    chargeId: String,
  },
  {
    timestamps: true,
  }
);

const Checkout = mongoose.model('checkout', checkoutSchema);

module.exports = Checkout;
