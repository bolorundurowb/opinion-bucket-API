/**
 * Created by bolorundurowb on 1/7/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opinionSchema = require('./opinion');

const topicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  opinions: [{
    type: Schema.ObjectId,
    ref: 'Opinion'
  }],
  categories: [{
    type: Schema.ObjectId,
    ref: 'Category'
  }]
});

const topicModel = mongoose.model('Topic', topicSchema);

module.exports = topicModel;
