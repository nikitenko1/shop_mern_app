const Discount = require('./../models/Discount');
const pagination = require('./../utils/pagination');

const discountCtrl = {
  createDiscount: async (req, res) => {
    try {
      const { code, value } = req.body;
      if (!code || !value)
        return res
          .status(400)
          .json({ msg: "Please provide discount code and it's value." });

      if (code.length < 4)
        return res
          .status(400)
          .json({ msg: 'Discount code should be at least 4 characters.' });

      if (value < 1 || value > 100)
        return res
          .status(400)
          .json({ msg: 'Discount value should be in range of 0 and 100.' });

      const findDiscount = await Discount.findOne({ code });
      if (findDiscount)
        return res
          .status(400)
          .json({ msg: `Discount with code ${code} has been used before.` });

      const newDiscount = new Discount({ code, value });
      await newDiscount.save();

      return res.status(200).json({
        msg: `Discount with code ${code} has been created successfully.`,
        discount: newDiscount,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getDiscount: async (req, res) => {
    try {
      const { limit, skip } = pagination(req);
      const data = await Discount.aggregate([
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
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1,
          },
        },
      ]);
      const discounts = data[0].totalData;
      const discountCount = data[0].count;
      let totalPage = 0;

      if (discounts.length === 0) {
        totalPage = 0;
      } else {
        if (discountCount % limit === 0) {
          totalPage = discountCount / limit;
        } else {
          totalPage = Math.floor(discountCount / limit) + 1;
        }
      }

      return res.status(200).json({ discounts, totalPage });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getDiscountById: async (req, res) => {
    try {
      const discount = await Discount.findOne({ code: req.params.id });
      if (!discount)
        return res
          .status(404)
          .json({ msg: `Discount with code ${req.params.id} not found.` });

      return res.status(200).json({ discount });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteDiscount: async (req, res) => {
    try {
      const discount = await Discount.findByIdAndDelete(req.params.id);
      if (!discount)
        return res
          .status(404)
          .json({ msg: `Discount with ID ${req.params.id} not found.` });

      return res.status(200).json({
        msg: `Discount with ID ${req.params.id} has been deleted successfully.`,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateDiscount: async (req, res) => {
    try {
      const { code, value } = req.body;
      if (!code || !value)
        return res
          .status(400)
          .json({ msg: "Please provide discount code and it's value." });

      if (code.length < 4)
        return res
          .status(400)
          .json({ msg: 'Discount code should be at least 4 characters.' });

      if (value < 1 || value > 100)
        return res
          .status(400)
          .json({ msg: 'Discount value should be in range of 0 and 100.' });

      const findDiscount = await Discount.findOne({
        _id: { $ne: req.params.id },
        code,
      });
      if (findDiscount)
        return res
          .status(400)
          .json({ msg: `Discount with code ${code} has been used before.` });

      const discount = await Discount.findOneAndUpdate(
        { _id: req.params.id },
        { code, value },
        { new: true }
      );
      if (!discount)
        return res
          .status(404)
          .json({ msg: `Discount with ID ${req.params.id} not found.` });

      return res.status(200).json({
        msg: 'Discount has been updated successfully.',
        discount,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = discountCtrl;
