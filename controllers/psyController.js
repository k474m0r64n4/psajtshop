var ObjectId = require('mongodb').ObjectId;
var psyService = require('../services/psyService');
var moment = require('moment');
var slug = require('slug');


exports.psy_list = function(req, res) {
    var find = {};
    psyService.psy_get(find, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('psylist', {
                title: 'psajt',
                data: result,
                moment: moment,
                user: req.user
            })
        }
    });
};

// Display list of all psy GET *
exports.psy_list_get = function(req, res) {
    var find = {};
    psyService.psy_get(find, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('backend/psylist', {
                title: 'psajt',
                data: result,
                moment: moment,
                user: req.user
            })
        }
    });
};

// Display detail page for a specific User GET
exports.psy_detail_admin = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };
    psyService.psy_get(find, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('backend/psydetails', {
                title: 'items List',
                data: result,
                moment: moment,
                user: req.user
            })
        }
    });
};

// Display profile page for User GET
exports.psy_detail = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };
    psyService.psy_get(find, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.render('psydetails', {
                title: 'items List',
                data: result,
                moment: moment,
                user: req.user
            })
        }
    });

};

// User delete on POST.
exports.psy_delete_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };
    psyService.psy_delete_post(find, function (err, result) {
        res.redirect('/admin/psy');
    });
};

// User create on POST
exports.psy_create_post = function(req, res) {
    var today = new Date();

    var psy = {
        name: req.body.name,
        info: "",
        dose: "",
        duration: "",
        createdOn : today,
        slug:slug(req.body.name, {lower: true}),
        hits: 0
    };
    var find = { name: psy.name };
    psyService.psy_get(find, function (err, result) {
        console.log(err);

        if (err) {
            res.status(500).send('error occured')
        } else {
            if (result === []) {
                res.status(500).send('psy already exists')
            } else {

                psyService .psy_post(psy, function (err, ress) {
                    res.redirect('/admin/psy')
                })
            }
        }
    });
};

// Display User update form on GET
exports.psy_update_get = function(req, res) {
    var find = { username : req.user.username};
    userService.user_get(find, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('profileedit', {
                title: 'Profil',
                user: req.user,
                data: result
            })
        }
    });
};

// User update on POST.
exports.psy_update_info_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };

    var info =  {
        overview: req.body.ukratko,
        history: req.body.istorijat,
        pharmacology: req.body.farmakologija,
        effects: req.body.efekti,
        myths: req.body.mitovi,
        therapeuticuse: req.body.svojstva
    };

    var data = {
        subname: req.body.subname,
        info: info
    };

    psyService.psy_update_post(find, data, function (err, result) {
        res.redirect('/admin/psy/' + o_id);
    });

};

exports.psy_update_dose_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };

    var dose =  {
        threshold: req.body.threshold,
        light: req.body.light,
        common: req.body.common,
        strong: req.body.strong,
        heavy: req.body.heavy
    };

    var duration =  {
        total: req.body.total,
        onset: req.body.onset,
        comeup: req.body.comeup,
        peak: req.body.peak,
        offset: req.body.offset
    };

    var data = {
        dose: dose,
        duration: duration
    };

    psyService.psy_update_post(find, data, function (err, result) {
        res.redirect('/admin/psy/' + o_id);
    });

};

exports.psy_update_image_post = function(req, res) {
    var img = { name: req.body.image} ;
    var mol = { name: req.body.molecul };
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };
    if(req.files !== null){

        img = req.files.img;
        img.mv("public/images/psihodelici/" + img.name, function (err) {
            if (err)
                return res.status(500).send(err);
        });

    }

    if(req.files !== null){
        mol = req.files.mol;

        mol.mv("public/images/psihodelici/" + mol.name, function (err) {
            if (err)
                return res.status(500).send(err);
        });
    }

    var data = {
        image: img.name,
        molecul: mol.name
    };

    psyService.psy_update_post(find, data, function (err, result) {
        res.redirect('/admin/psy/' + o_id);
    });

};