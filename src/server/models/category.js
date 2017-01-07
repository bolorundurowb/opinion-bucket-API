/**
 * Created by bolorundurowb on 1/7/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: String,
  topics: [{
    type: ObjectId
  }]
});

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;