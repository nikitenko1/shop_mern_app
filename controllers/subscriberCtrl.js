const Subscriber = require('./../models/Subscriber');
const pagination = require('./../utils/pagination');
const validateEmail = require('./../utils/validator');

const subscriberCtrl = {
  getSubscriber: async (req, res) => {
    const { skip, limit } = pagination(req);

    try {
      const data = await Subscriber.aggregate([
        {
          $facet: {
            totalData: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
        {
          $project: {
            totalData: 1,
            // Returns the element at the specified array index
            // { $arrayElemAt: [ <array>, <idx> ] }
            count: { $arrayElemAt: ['$totalCount.count', 0] },
          },
        },
      ]);

      const subscribers = data[0].totalData;
      const subscriberCount = data[0].count;
      let totalPage = 0;

      if (subscribers.length === 0) {
        totalPage = 0;
      } else {
        if (subscriberCount % limit === 0) {
          totalPage = subscriberCount / limit;
        } else {
          totalPage = Math.floor(subscriberCount / limit) + 1;
        }
      }
      return res.status(200).json({
        subscribers,
        totalPage,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createSubscriber: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(400).json({ msg: 'Please provide email address.' });

      if (!validateEmail(email))
        return res
          .status(400)
          .json({ msg: 'Email address format is incorrect.' });

      const findSubscriber = await Subscriber.findOne({ email });
      if (findSubscriber)
        return res.status(400).json({
          msg: `Email is currently subscribing to "Let's work ||" newsletter.`,
        });
      const newSubscriber = new Subscriber({ email });
      await newSubscriber.save();

      return res.status(200).json({
        msg: `Successfully subscribe to "Let's work ||" newsletter.`,
        subscriber: newSubscriber,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteSubscriber: async (req, res) => {
    try {
      const subscriber = await Subscriber.findOneAndDelete({
        _id: req.params.id,
      });
      if (!subscriber)
        return res.status(404).json({ msg: 'Subscriber not found.' });

      return res
        .status(200)
        .json({ msg: 'Subscriber has been deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = subscriberCtrl;
