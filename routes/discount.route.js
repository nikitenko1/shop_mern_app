const router = require('express').Router();
const discountCtrl = require('../controllers/discountCtrl');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(isAuthenticated, authorizeRoles('admin'), discountCtrl.getDiscount)
  .post(isAuthenticated, authorizeRoles('admin'), discountCtrl.createDiscount);

router
  .route('/:id')
  .get(discountCtrl.getDiscountById)
  .patch(isAuthenticated, authorizeRoles('admin'), discountCtrl.updateDiscount)
  .delete(
    isAuthenticated,
    authorizeRoles('admin'),
    discountCtrl.deleteDiscount
  );

module.exports = router;
