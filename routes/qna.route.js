const router = require('express').Router();
const qnaCtrl = require('../controllers/qnaCtrl');
const { isAuthenticated } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router.route('/').post(isAuthenticated, qnaCtrl.createQna);

router.route('/:product').get(qnaCtrl.getQna);

router.route('/like/:id').patch(isAuthenticated, qnaCtrl.likeQna);
router.route('/unlike/:id').patch(isAuthenticated, qnaCtrl.unlikeQna);

module.exports = router;
