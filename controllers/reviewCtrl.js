const pagination = require('./../utils/pagination');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('../server');
const Review = require('./../models/Review');
const Checkout = require('./../models/Checkout');

const reviewCtrl = {
  createReview: async (req, res) => {
    const http = createServer(app);
    const io = new Server(http, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    try {
      const { star, content, product } = req.body;
      if (!star || !content || !product)
        return res.status(400).json({ msg: 'Please provide every field.' });

      const checkHistory = await Checkout.find({
        user: req.user._id,
        'items.product': product,
      });
      const historyLength = checkHistory.length;

      const checkReview = await Review.find({ user: req.user._id, product });
      const reviewLength = checkReview.length;

      let eligibleStatus = false;

      if (historyLength === 0) eligibleStatus = false;
      else if (historyLength > 0 && reviewLength !== historyLength)
        eligibleStatus = true;
      else eligibleStatus = false;

      if (!eligibleStatus)
        return res
          .status(400)
          .json({ msg: "You're not eligible to review this product." });

      const newReview = new Review({
        user: req.user._id,
        product,
        star,
        content,
      });

      const reviewData = {
        ...newReview._doc,
        user: req.user,
      };

      io.to(product).emit('createReviewToClient', reviewData);

      await newReview.save();

      return res.status(200).json({
        msg: 'Review has been created successfully.',
        review: newReview,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  checkReviewEligibility: async (req, res) => {
    try {
      const checkHistory = await Checkout.find({
        user: req.user._id,
        'items.product': req.params.product,
      });
      const historyLength = checkHistory.length;

      const checkReview = await Review.find({
        user: req.user._id,
        product: req.params.product,
      });
      const reviewLength = checkReview.length;

      let eligibleStatus = false;

      if (historyLength === 0) eligibleStatus = false;
      else if (historyLength > 0 && reviewLength !== historyLength)
        eligibleStatus = true;
      else eligibleStatus = false;

      return res.status(200).json({ status: eligibleStatus });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getReview: async (req, res) => {
    try {
      const { skip, limit } = pagination(req, 4);

      const reviews = await Review.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  product: new mongoose.Types.ObjectId(req.params.product),
                },
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'user',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              { $unwind: '$user' },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  product: new mongoose.Types.ObjectId(req.params.product),
                },
              },
              { $count: 'count' },
            ],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1,
          },
        },
      ]);

      const reviewsData = reviews[0].totalData;
      const totalReview = reviews[0].count;
      let totalPage = 0;

      if (reviewsData.length === 0) {
        totalPage = 0;
      } else {
        if (totalReview % limit === 0) {
          totalPage = totalReview / limit;
        } else {
          totalPage = Math.floor(totalReview / limit) + 1;
        }
      }

      return res.status(200).json({
        reviews: reviewsData,
        totalPage,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  likeReview: async (req, res) => {
    const http = createServer(app);
    const io = new Server(http, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    try {
      const review = await Review.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { like: req.user._id },
        },
        { new: true }
      );

      if (!review)
        return res
          .status(404)
          .json({ msg: `Review with ID ${req.params.id} not found.` });

      io.to(req.body.product).emit('likeReviewToClient', {
        id: req.params.id,
        user: req.user._id,
      });

      return res.status(200).json({ msg: 'Review liked' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unlikeReview: async (req, res) => {
    const http = createServer(app);
    const io = new Server(http, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    try {
      const review = await Review.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { like: req.user._id },
        },
        { new: true }
      );

      if (!review)
        return res
          .status(404)
          .json({ msg: `Review with ID ${req.params.id} not found.` });

      io.to(req.body.product).emit('unlikeReviewToClient', {
        id: req.params.id,
        user: req.user._id,
      });

      return res.status(200).json({ msg: 'Review unliked.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getproductRating: async (req, res) => {
    try {
      const data = await Review.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  product: new mongoose.Types.ObjectId(req.params.product),
                },
              },
              {
                $group: {
                  _id: null,
                  totalRating: { $sum: '$star' },
                },
              },
            ],
            totalCount: [
              {
                $match: {
                  product: new mongoose.Types.ObjectId(req.params.product),
                },
              },
              { $count: 'count' },
            ],
          },
        },
        {
          $project: {
            totalData: 1,
            count: { $arrayElemAt: ['$totalCount.count', 0] },
          },
        },
      ]);

      const rating = data[0].totalData[0].totalRating;
      const totalRater = data[0].count;
      const calculatedRating = rating / totalRater;

      return res
        .status(200)
        .json({ rating: calculatedRating.toFixed(1), totalRater });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = reviewCtrl;
