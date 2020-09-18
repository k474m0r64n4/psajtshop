var Item = require('../models/itemModel');

function item_get (find,limit, skip, sort, callback) {
    return Item.find(find).limit(limit).skip(skip).sort(sort).exec(callback);
}

function item_post (query, callback) {
    return Item.create(query).then(callback);
}

function item_update_post(query, set, callback) {
    return Item.update(query,set).then(callback);
}

function item_delete_post(query, callback) {
    return Item.remove(query).then(callback);
}

exports.item_get = item_get;
exports.item_post = item_post;
exports.item_update_post = item_update_post;
exports.item_delete_post = item_delete_post;