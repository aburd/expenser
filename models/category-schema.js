var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/finance';
var assert = require('assert');

var Schema = mongoose.Schema;
var categorySchema = new Schema({
  name: {type: String, required: true},
  for: String,
  dateCreated: Date,
  user: String
});

categorySchema.methods.aboutMe = function() {
  var about = `Category -${this.name}- was created at ${this.dateCreated.toDateString()}`;
  console.log(about);
}

var Category1 = mongoose.model('Category', categorySchema);

function addCategory(data) {

  mongoose.connect(url);
  var db = mongoose.connection;
  db.on('error', console.log.bind(console, 'Error connecting to db.'));
  db.once('open', () => {

    var newCategory = {
      name: data['add-name'],
      for: data['add-for'],
      dateCreated: new Date(),
      user: 'Aaron'
    };

    var theNewCategory = new Category1(newCategory);
    theNewCategory.save(function(err, theNewCategory) {
      assert.equal(null, err);
      theNewCategory.aboutMe();
      db.close();
    });

  });

}

module.exports = addCategory;