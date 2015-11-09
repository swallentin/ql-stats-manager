var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serverSchema = new Schema({
    owner: String,
    network: String,
    name: String,
    hostname: String,
    gameport: Number
});

module.exports = mongoose.model('Server', serverSchema);
