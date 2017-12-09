var mongoose = require('mongoose');

//Each of the descriptors will be an array of the dependency data and tagged with the name


var dependencySchema = new mongoose.Schema({
  descriptorName: {type: String, required: false},
  descriptorXunits: {type: Array, required: false},
  descriptorXname: {type: String, required: false},
  descriptorYunits: {type: Array, required: false},
  descriptorYname: {type: String, required: false},
  created_at: Date,
  updated_at: Date
});

var Dependency = mongoose.model('Dependency', dependencySchema);

module.exports = Dependency;
