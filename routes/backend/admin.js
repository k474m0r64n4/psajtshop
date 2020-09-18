var express = require('express');
var router = express.Router();

var itemController = require('../../controllers/itemController');
//var ordersController = require('../../controllers/ordersController');
var userController = require('../../controllers/userController');
var blogController = require('../../controllers/blogController');
var psyController = require('../../controllers/psyController');
var commentController = require('../../controllers/commentController');


var admin = function (req, res, next) {
    if (req.isAuthenticated()) {
        var role = req.user.role;
        if(role === 'admin' || role === 'vendor'){
                next()
            } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/login')
    }
};

/* Item routes */
 router.get('/', blogController.getAdmin);
// router.get('/create',admin, itemController.item_create_get);
// router.post('/create',admin, itemController.item_create_post);
// router.get('/update/:id',admin, itemController.item_update_get);
// router.post('/update',admin, itemController.item_update_post);
// router.post('/delete/:id',admin, itemController.item_delete_post);

/* Blog routes */
router.get('/blog', blogController.blog_list_get);
router.get('/blog/:id',  blogController.blog_update_get);
router.post('/blog/create',  blogController.blog_create_post);
router.post('/blog/update/:id',  blogController.blog_update_post);
router.post('/blog/updateimage/:id',  blogController.blog_update_image_post);
router.post('/blog/delete/:id',  blogController.blog_delete_post);

/* Psy routes */
router.get('/psy', psyController.psy_list_get);
router.get('/psy/:id',  psyController.psy_detail_admin);
router.post('/psy/create',  psyController.psy_create_post);
router.post('/psy/updateinfo/:id',  psyController.psy_update_info_post);
router.post('/psy/updatedose/:id',  psyController.psy_update_dose_post);
router.post('/psy/updateimage/:id',  psyController.psy_update_image_post);
router.post('/psy/delete/:id',  psyController.psy_delete_post);

router.get('/comments', commentController.comment_list_get);
router.post('/comments/update/:id', commentController.comment_update);
router.post('/comments/delete/:id', commentController.comment_delete_post);

/* Item Routes */
router.get('/items',  itemController.item_list_get);
router.post('/items/create',  itemController.item_create_post);
router.get('/items/:id',  itemController.item_update_get);


/* User routes */
router.get('/userlist/',  userController.user_list);
router.get('/userlist/:id',  userController.user_detail_admin);
router.post('/user/delete/:id',  userController.user_delete_post);

/* Order Routes */
// router.get('/orders/', admin, ordersController.order_list);
// router.get('/orders/:id', admin, ordersController.order_detail);
// router.post('/orders/update/:id', admin, ordersController.order_update_status);

module.exports = router;


