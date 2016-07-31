// INCOME SCHEMA
var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/finance';
var assert = require('assert');

var Schema = mongoose.Schema;

var validator = [/.{1,}/, 'Needs a category']

var incomeSchema = new Schema({
  amount: Number,
  category: {
    type: String,
    validate: {
      validator: function(v) {
        return /\w{2,}/.test(v);
      },
      message: '{VALUE} is not a category!'
    },
    required: [true, 'Category is a required field!']
  },
  description: {
    type: String,
    default: 'No description'
  },
  date: {
    type: Date,
    default: Date.now
  },
  'date-created': {
    type: Date,
    default: Date.now
  },
  offset: Number
})

incomeSchema.methods.findThisCategory = function(cb) {
  return this.model('Income').find({
    category: this.category
  }, cb)
}

var Income = mongoose.model('Income', incomeSchema)

module.exports = Income