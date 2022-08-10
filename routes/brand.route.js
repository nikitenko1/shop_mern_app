const router = require('express').Router();
const brandCtrl = require('../controllers/brandCtrl');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(brandCtrl.getBrand)
  .post(isAuthenticated, authorizeRoles('admin'), brandCtrl.createBrand);

router
  .route('/admin')
  .get(isAuthenticated, authorizeRoles('admin'), brandCtrl.getBrandAdmin);

router
  .route('/:id')
  .patch(isAuthenticated, authorizeRoles('admin'), brandCtrl.updateBrand)
  .delete(isAuthenticated, authorizeRoles('admin'), brandCtrl.deleteBrand);

module.exports = router;
