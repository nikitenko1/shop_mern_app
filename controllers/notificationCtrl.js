const Notification = require('../models/Notification');

const notificationCtrl = {
  createNotification: async (req, res) => {
    try {
      const { transaction, message } = req.body;
      if (!transaction || !message)
        return res.status(400).json({
          msg: 'Please provide transaction and message for notification.',
        });

      const newNotification = new Notification({ transaction, message });
      await newNotification.save();
    } catch (err) {
      return res.status(200).json({ msg: err.message });
    }
  },
  getNotification: async (req, res) => {
    try {
      const notifications = await Notification.find()
        .sort('-createdAt')
        .limit(10);
      return res.status(200).json({ notifications });
    } catch (err) {
      return res.status(200).json({ msg: err.message });
    }
  },
  readNotification: async (req, res) => {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id },
        {
          isRead: true,
        },
        { new: true }
      );

      return res.status(200).json({ notification });
    } catch (err) {
      return res.status(200).json({ msg: err.message });
    }
  },
};

module.exports = notificationCtrl;
