const router = require('express').Router();
const newsletterCtrl = require('../controllers/newsletterCtrl');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(isAuthenticated, authorizeRoles('admin'), newsletterCtrl.getNewsletters)
  .post(
    isAuthenticated,
    authorizeRoles('admin'),
    newsletterCtrl.composeNewsletter
  );

router
  .route('/:id')
  .get(
    isAuthenticated,
    authorizeRoles('admin'),
    newsletterCtrl.getNewsletterById
  );

module.exports = router;
