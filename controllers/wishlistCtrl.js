const Wishlist = require('./../models/Wishlist');

const wishlistCtrl = {
  createWishlist: async (req, res) => {
    try {
      const findWishlist = await Wishlist.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (findWishlist)
        return res
          .status(400)
          .json({ msg: 'Item already in wishlist before.' });

      const newWishlist = new Wishlist({
        user: req.user._id,
        product: req.body.product,
      });
      await newWishlist.save();

      return res
        .status(200)
        .json({ msg: 'item added to wishlist.', newWishlist });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getWishlist: async (req, res) => {
    try {
      const wishlists = await Wishlist.find({ user: req.user._id }).populate(
        'product'
      );
      return res.status(200).json({ wishlists });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteWishlist: async (req, res) => {
    try {
      const wishlist = await Wishlist.findOneAndDelete({
        user: req.user._id,
        product: req.params.id,
      });
      if (!wishlist)
        return res.status(400).json({ msg: 'Wishlist not found.' });

      return res.status(200).json({ msg: 'Item removed from wishlist.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = wishlistCtrl;
