const router = require('express').Router();
const subscriberCtrl = require('../controllers/subscriberCtrl');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(isAuthenticated, authorizeRoles('admin'), subscriberCtrl.getSubscriber);

router.route('/').post(subscriberCtrl.createSubscriber);

router
  .route('/:id')
  .delete(
    isAuthenticated,
    authorizeRoles('admin'),
    subscriberCtrl.deleteSubscriber
  );

module.exports = router;
