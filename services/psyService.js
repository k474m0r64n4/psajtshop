var Psy = require('../models/psyModel');

function psy_get (find, callback) {
    return Psy.find(find).exec(callback);
}

function psy_post (query, callback) {
    return Psy.create(query).then(callback);
}

function psy_update_post(query, set, callback) {
    return Psy.update(query,set).then(callback);
}

function psy_delete_post(query, callback) {
    return Psy.remove(query).then(callback);
}

exports.psy_get = psy_get;
exports.psy_post = psy_post;
exports.psy_update_post = psy_update_post;
exports.psy_delete_post = psy_delete_post;
