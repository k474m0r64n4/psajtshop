var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');
var psyController = require('../controllers/psyController');
var blogController = require('../controllers/blogController');
var commentController = require('../controllers/commentController');
var itemController = require('../controllers/itemController');

/* GET home page. */
router.get('/', blogController.getIndex);

router.get('/login', userController.getLogin);
router.get('/signup', userController.getSignup);
router.get('/logout', userController.getLogout);

router.get('/novosti', blogController.blog_list);
router.get('/novosti/:id', blogController.blog_detail);
router.post('/comment/:id', commentController.comment_post)

router.get('/psihodelici', psyController.psy_list);
router.get('/psihodelici/:id', psyController.psy_detail);

router.get('/proizvodi', itemController.item_list);
router.get('/proizvodi/:id', itemController.item_detail);
router.get('/cart');
router.get('/checkout');


module.exports = router;
