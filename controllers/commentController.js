var ObjectId = require('mongodb').ObjectId;

var commentService = require('../services/commentService');



// Comment list GET
exports.comment_list_get = function(req, res) {
    commentService.comment_get({}, function (err, result) {
        res.render('backend/commentlist', {
            title: 'Comment list',
            data: result,
            user: req.user
        })
    });
};

// Comment update POST
exports.comment_update = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var status = req.body.status;
    var find = { _id:o_id};
    var set = { status: status};
    commentService.comment_update_post(find, set, function (err, result) {
        res.redirect('/admin/comments');

    });
};

// Comment delete POST
exports.comment_delete_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id:o_id};
    commentService.comment_delete_post(find, function (err, result) {
        res.redirect('/admin/comments');

    });
};

// Comment create POST
exports.comment_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);

    var today = new Date();
    var com = {
        blogId: o_id,
        username: req.body.username,
        email: req.body.email,
        comText:req.body.comText,
        status: 'on moderation',
        createdOn: today
    };

    commentService.comment_post(com, function (err, result) {
        res.redirect('/novosti/' + com.blogId)
    });
};
