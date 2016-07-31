var express = require('express')
var app = express()
var router = express.Router()
var assert = require('assert')

var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;
var url = 'mongodb://localhost:27017/finance';
var dbHelpers = require('../myModules/db-helpers.js');

//++++++++++++++++
//++++++++++++++++
//+++ EXPENSES ===
//++++++++++++++++
//++++++++++++++++

//++++++++++++++
//NEW EXPENSE
//++++++++++++++
router.get('/new', function(req, res) {
  MongoClient.connect(url, (err, db) => {
    // Get categories
    db.collection('categories').find({}).toArray((err, categories) => {
      res.render('new-expense', {
        title: 'Why daddy why?',
        categories: categories
      })
    });
  });

});

//++++++++++++++
// ADD'S EXPENSE
//++++++++++++++
router.post('/add', function(req, res) {

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    console.log('Connected to db to create data.');
    var collection = db.collection('expensesTest');
    var expense = dbHelpers.createExpense(req.body);
    collection.insertOne(expense, function(err, result) {
      assert.equal(null, err);

      console.log('Write successful with: ', result)
      app.locals.feedback = "Added successfully!";
      // res.redirect('/');

      db.close();
    });

  });
});

//++++++++++++++
//DELETE EXPENSE
//++++++++++++++
router.post('/delete', function(req, res) {
  console.log('POST request for expense delete type sent.');

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    db.collection('expensesTest').deleteOne({
      '_id': ObjectId(req.body.id)
    }, function(err, r) {
      assert.equal(null, err);
      assert.equal(1, r.deletedCount);
      console.log('Document successfully deleted');

      db.close();
    });
  });
});

//++++++++++++++
//EDIT EXPENSE
//++++++++++++++
router.get('/edit/:id', (req, res) => {
  console.log('Edit request for: ', req.params.id);

  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log('Connected to db. Retriving document to edit...');

    // Get related expense
    db.collection('expensesTest').findOne({
      _id: ObjectId(req.params.id)
    }, (err, expense) => {
      assert.equal(null, err);

      // Get categories
      db.collection('categories').find({}).toArray((err, categories) => {
        var theDate = dateFormat(expense.date, 'yyyy-mm-dd');
        res.render('edit-expense', {
          title: 'Edit an expense, yo',
          expense: expense,
          categories: categories,
          theDate: theDate
        });

      });
    });

  });
});

router.post('/update', (req, res) => {
  console.log('Update received');

  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);

    var expense = dbHelpers.createExpense(req.body);

    db.collection('expensesTest').updateOne({
      _id: ObjectId(req.body['the-id'])
    }, {
      $set: expense
    }, (err, result) => {
      console.log('Success with: ', req.body['the-id']);
      db.close();

      res.redirect('/');
    })
  })
});

module.exports = router