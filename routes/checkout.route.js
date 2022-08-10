const router = require('express').Router();
const checkoutCtrl = require('../controllers/checkoutCtrl');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(isAuthenticated, checkoutCtrl.getCheckoutHistory)
  .post(isAuthenticated, checkoutCtrl.createCheckout);

router
  .route('/transaction')
  .get(
    isAuthenticated,
    authorizeRoles('admin'),
    checkoutCtrl.getAllTransactions
  );

router.route('/status/:id').get(isAuthenticated, checkoutCtrl.getPaymentStatus);

router.route('/:id').get(isAuthenticated, checkoutCtrl.getTransactionById);

module.exports = router;
