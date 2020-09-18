var mongoose = require('mongoose');

var schema = mongoose.Schema;

var blogSchema = new schema({
    title:{
        type:String
    },
    description: {
        type: String
    },
    content_text: {
        type: String
    },
    image: {
        type: String
    },
    category: {
        type: String
    },
    createdOn: {
        type: Date
    },
    slug: {
        type: String
    },
    tags: {
        type: Array
    },
    hits: {
        type: Number
    }
});

module.exports = mongoose.model('blog',blogSchema);