var moment = require('moment');
var ObjectId = require('mongodb').ObjectId;
var itemService = require('../services/itemService');
var userService = require('../services/userService');

// Front
//
// Display Item list GET
exports.item_list = function(req, res) {
    var find = {};
    var limit = 0;
    var skip = 0;
    var sort = { _id : -1 };

    itemService.item_get(find, limit, skip, sort, function (err, result) {
        res.render('itemlist', {
            title: 'Add New item',
            data: result,
            user: req.user,
            moment: moment
        })
    });
};


// Display detail page for Item GET
exports.item_detail = function(req, res) {
    var o_id = new ObjectId(req.params.id);


    var find ={"_id": o_id};
    var limit = 0;
    var skip = 0;
    var sort = {};


    // Find Item
    itemService.item_get(find, limit, skip, sort, function (err, result) {
        if (err) {
            res.send(err)
        } else {
                res.render('itemdetails', {
                    title: 'Proizvod',
                    data: result,
                    user: req.user
                })
        }
    });
};

// Admin panel
// Display Item list GET
exports.item_list_get = function(req, res) {
    var find = {};
    var limit = 0;
    var skip = 0;
    var sort = { _id : -1 };

    itemService.item_get(find, limit, skip, sort, function (err, result) {
        res.render('backend/itemlist', {
            title: 'Add New item',
            data: result,
            user: req.user,
            moment: moment
        })
    });

};

// Display Item update form GET
exports.item_update_get = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };
    var limit = 0;
    var skip = 0;
    var sort = { _id : -1 };
    itemService.item_get(find, limit, skip, sort, function (err, result) {
        res.render('backend/updateitem', {
            title: 'Add New item',
            data: result,
            user: req.user
        })
    });
};

// Item create POST
exports.item_create_post = function(req, res) {
    var today = new Date();
    var img = req.files.img;
    var find = { name: req.body.name };
    var limit = 0;
    var skip = 0;
    var sort = { _id : -1 };
    var tag = req.body.tags;

    var item = {
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        description: req.body.description,
        content_text:req.body.content_text,
        image: img.name,
        category: req.body.category,
        tags: tag.split(","),
        origin: req.body.origin,
        status:req.body.status,
        createdOn: today
    };
    itemService.item_get(find, limit, skip, sort, function (err, result) {
        if (err) {
            res.status(500).send('error occured')
        } else {
            if (result === []) {
                res.status(500).send('Item already exists')
            } else {
                img.mv("public/images/items/" + img.name, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
                itemService.item_post(item, function (err, ress) {
                    res.redirect('/admin/items')
                })
            }
        }
    });
};

// Item delete POST.
exports.item_delete_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id};
    itemService.item_delete_post(find, function (err, result) {
        res.redirect('/admin')
    });
};