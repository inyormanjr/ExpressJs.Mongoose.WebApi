var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PlayerSchema = new Schema({
});

module.exports = mongoose.model('Player', PlayerSchema);
