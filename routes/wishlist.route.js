const router = require('express').Router();
const wishlistCtrl = require('../controllers/wishlistCtrl');
const { isAuthenticated } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(isAuthenticated, wishlistCtrl.getWishlist)
  .post(isAuthenticated, wishlistCtrl.createWishlist);

router.route('/:id').delete(isAuthenticated, wishlistCtrl.deleteWishlist);

module.exports = router;
