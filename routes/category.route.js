const router = require('express').Router();
const categoryCtrl = require('../controllers/categoryCtrl');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(isAuthenticated, categoryCtrl.getCategory)
  .post(isAuthenticated, authorizeRoles('admin'), categoryCtrl.createCategory);

router.route('/home').get(categoryCtrl.getHomeCategory);

router
  .route('/admin')
  .get(isAuthenticated, authorizeRoles('admin'), categoryCtrl.getAdminCategory);

router
  .route('/:id')
  .patch(isAuthenticated, authorizeRoles('admin'), categoryCtrl.updateCategory)
  .delete(
    isAuthenticated,
    authorizeRoles('admin'),
    categoryCtrl.deleteCategory
  );

module.exports = router;
