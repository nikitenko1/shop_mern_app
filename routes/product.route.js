const router = require('express').Router();
const productCtrl = require('../controllers/productCtrl');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(productCtrl.getProduct)
  .post(isAuthenticated, authorizeRoles('admin'), productCtrl.createProduct);

router.route('/home').get(productCtrl.getHomeProduct);

router.route('/search').get(productCtrl.searchProduct);

router.route('/all').get(productCtrl.getAllProducts);

router.route('/similar/:id/:category').get(productCtrl.getSimilarProduct);

router
  .route('/:id')
  .get(productCtrl.getProductById)
  .patch(isAuthenticated, authorizeRoles('admin'), productCtrl.updateProduct)
  .delete(isAuthenticated, authorizeRoles('admin'), productCtrl.deleteProduct);

module.exports = router;
