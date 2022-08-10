const router = require('express').Router();
const reviewCtrl = require('../controllers/reviewCtrl');
const { isAuthenticated } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router.route('/').post(isAuthenticated, reviewCtrl.createReview);

router
  .route('/check/:product')
  .get(isAuthenticated, reviewCtrl.checkReviewEligibility);

router.route('/like/:id').patch(isAuthenticated, reviewCtrl.likeReview);
router.route('/unlike/:id').patch(isAuthenticated, reviewCtrl.unlikeReview);

router.route('/rating/:product').get(reviewCtrl.getproductRating);

router.route('/:product').get(reviewCtrl.getReview);

module.exports = router;
