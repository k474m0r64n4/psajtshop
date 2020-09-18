var mongoose = require('mongoose');

var schema = mongoose.Schema;

var psySchema = new schema({
    name:{
        type:String
    },
    subname: {
        type: String
    },
    image: {
        type: String
    },
    molecul: {
        type: String
    },
    info: {
        type: Object
    },
    dose: {
        type: Object
    },
    duration: {
        type: Object
    },
    createdOn: {
        type: Date
    },
    slug: {
        type: String
    },
    hits: {
        type: Number
    }
});

module.exports = mongoose.model('psy',psySchema);