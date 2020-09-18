var moment = require('moment');
var ObjectId = require('mongodb').ObjectId;
var slug = require('slug');

var blogService = require('../services/blogService');
var psyService = require('../services/psyService');
var commentService = require('../services/commentService');

// Front
// Index page GET
exports.getIndex = function(req, res) {
    var kultura = [];
    var nauka = [];

    blogService.blog_get({category: "Kultura"},3,0,{},function (err, result){
        kultura = result;
    });
    blogService.blog_get({category: "Nauka"},3,0,{}, function (err, result){
        nauka = result;
    });

    blogService.blog_get({},0,0,{ _id: -1 }, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            psyService.psy_get({}, function (err, psy) {
                res.render('index', {
                    title: 'Psajt',
                    data: blog,
                    psy: psy,
                    nauka:nauka,
                    kultura: kultura,
                    moment: moment,
                    user: req.user
                })
            });
        }
    });

};
exports.getAdmin = function(req, res) {
    res.render('backend/admin', {
        title: 'Psajt',
        moment: moment,
        user: req.user
    })

};

// Display list of all Blogs GET
module.exports.blog_list = function(req, res) {
    var query = req.query;
    var current = 1;
    var count = 0;
    var user = req.user;
    var limit = 6;
    var pages = 1;
    var find = {};
    var sort = {"_id": -1};
    var popular = [];

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    // Category Query
    if(query.category){
        find.category = query.category.capitalize();
    }

    // Page Query
    if(query.page){
        current = query.page;
    }
    var skip = limit * (current-1);

    // Count Blogs
    blogService.blog_get(find, 0, 0, {}, function (err, result) {
        count = result.length;
        pages = parseInt((count / limit) + 0.9);
    });

    // Get popular
    blogService.blog_get({}, 3,0, { hits: -1 }, function (err, result) {
        popular = result;
    });

    // Find Blogs
    blogService.blog_get(find,limit, skip, sort, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.render('bloglist', {
                title: 'Blog',
                data: result,
                popular: popular,
                user: user,
                moment: moment,
                current: current,
                pages: pages
            })
        }
    });

};

// Display detail Blog page GET
module.exports.blog_detail = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id : o_id };
    var popular = [];
    var comments = [];
 //   var findComm = { blogId: o_id, status: 'approuve' };

    // Get popular
    blogService.blog_get({}, 3,0, { hits: -1 }, function (err, result) {
        popular = result;
    });

    commentService.comment_get(find, function (err, result){
        comments = result;
    });

    // Find Blog
    blogService.blog_get(find, 0,0,{}, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            blogService.blog_update_post(find, {$inc : { hits:1 }});
        //    commentService.comment_get(findComm, function (err, comments) {
                res.render('blogdetails', {
                    title: 'Blog',
                    user: req.user,
                    moment: moment,
                    data: result,
                    popular: popular
                  //  coms: comments
                })
        //    });
        }
    });
};

// Admin Panel
// Blog list GET
module.exports.blog_list_get = function(req, res) {
    blogService.blog_get({},0,0,{}, function (err, result) {
        res.render('backend/bloglist', {
            title: 'Blog list admin',
            data: result,
            moment: moment,
            user: req.user
        })
    });
};

// Blog create POST
exports.blog_create_post = function(req, res) {
    var today = new Date();
    var img = {name: "default.jpg"};
    var tag = req.body.tags;

    if(req.files !== null){
        img = req.files.img;
        img.mv("public/images/blog/" + img.name, function (err) {
            if (err)
                return res.status(500).send(err);
        });
    }


    var blog = {
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        content_text:req.body.content_text,
        image: img.name,
        createdOn: today,
        tags: tag.split(","),
        slug:slug(req.body.title, {lower: true}),
        hits: 0
    };
    var find = { name: req.body.name };
    var limit = 0;
    var skip = 0;
    var sort = { _id : -1 };

    blogService.blog_get(find, limit, skip, sort, function (err, result) {
        if (err) {
            res.status(500).send('error occured')
        } else {
            if (result === []) {
                res.status(500).send('Blog already exists')
            } else {

                blogService.blog_post(blog, function (err, ress) {
                    res.redirect('/admin/blog')
                })
            }
        }
    });
};

// Blog updte GET
exports.blog_update_get = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    blogService.blog_get({ _id: o_id  }, 0,0,{}, function (err, result) {
        res.render('backend/updateblog', {
            title: 'Update blog',
            data: result,
            user: req.user
        })
    });
};

// Blog update POST
exports.blog_update_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id};
    var tag = req.body.tags;


    var blog = {
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        content_text:req.body.content_text,
        slug:slug(req.body.title, {lower: true}),
        tags: tag.split(",")
    };

    blogService.blog_update_post(find, blog, function (err, result) {
        res.redirect('/admin/blog');
    });

};

exports.blog_update_image_post = function(req, res) {
    var img = { name: req.body.image} ;
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };

    if(req.files !== null){
        img = req.files.img;
        img.mv("public/images/blog/" + img.name, function (err) {
            if (err)
                return res.status(500).send(err);
        });

    }

    var data = {
        image: img.name
    };

    blogService.blog_update_post(find, data, function (err, result) {
        res.redirect('/admin/blog/' + o_id);
    });

};

// Blog delete POST.
exports.blog_delete_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id};

    blogService.blog_delete_post(find, function (err, result) {
        res.redirect('/admin/blog')
    });
};
