const Checkout = require('./../models/Checkout');
const pagination = require('./../utils/pagination');

const checkoutCtrl = {
  getCheckoutHistory: async (req, res) => {
    try {
      const checkouts = await Checkout.find({ user: req.user._id })
        .sort('-createdAt')
        .populate('items.product');
      return res.status(200).json({ checkouts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  createCheckout: async (req, res) => {
    try {
      const {
        recipientName,
        recipientPhone,
        recipientEmail,
        province,
        city,
        district,
        postalCode,
        address,
        expedition,
        // expeditionService,
        // expeditionFee,
        // estimatedDay,
        payPhoneNumber,
        discount,
        items,
        totalPrice,
      } = req.body;

      if (
        !recipientName ||
        !recipientPhone ||
        !recipientEmail ||
        !province ||
        !city ||
        !district ||
        !postalCode ||
        !address ||
        !expedition
        // !expeditionService ||
        // !expeditionFee ||
        // !estimatedDay
      ) {
        return res
          .status(400)
          .json({ msg: 'Please fill every information on the checkout page.' });
      }

      const newCheckout = new Checkout({
        user: req.user._id,
        recipientName,
        recipientPhone,
        recipientEmail,
        province,
        city,
        district,
        postalCode,
        address,
        expedition,
        // expeditionService,
        // expeditionFee,
        // estimatedDay,
        payPhoneNumber: payPhoneNumber,
        discount,
        items,
        totalPrice,
        chargeId: '',
      });

      // const transaction = await createPayTransaction(
      //   totalPrice,
      //   '+' + payPhoneNumber,
      //   newCheckout._id
      // );
      // newCheckout.chargeId = transaction.id;
      // newCheckout.status = transaction.status;
      newCheckout.chargeId = '001001001001';
      newCheckout.status = 'success';

      return res.status(200).json({
        msg: 'Cart has been checkout successfully.',
        checkout: newCheckout,
        user: req.user.name,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPaymentStatus: async (req, res) => {
    try {
      // const paymentStatus = await getChargeStatus(req.params.id);
      return res.status(200).json({ status: 'success' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllTransactions: async (req, res) => {
    try {
      const { skip, limit } = pagination(req);

      const transactions = await Checkout.find()
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('items.product user');
      const transactionCount = await Checkout.find().countDocuments();
      let totalPage = 0;

      if (transactions.length === 0) {
        totalPage = 0;
      } else {
        if (transactionCount % limit === 0) {
          totalPage = transactionCount / limit;
        } else {
          totalPage = Math.floor(transactionCount / limit) + 1;
        }
      }

      return res.status(200).json({ transactions, totalPage });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getTransactionById: async (req, res) => {
    try {
      const transaction = await Checkout.findById(req.params.id).populate(
        'items.product user'
      );
      if (!transaction)
        return res.status(404).json({ msg: 'Transaction not found.' });

      return res.status(200).json({ transaction });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = checkoutCtrl;
