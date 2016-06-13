var express = require('express');
var router = express.Router();
var assert = require('assert');
var mongodb = require('mongodb');
var app = express();
var ObjectId = mongodb.ObjectID;

var aggregateByDate = require('../myModules/aggregateDate.js');
var dbHelpers = require('../myModules/db-helpers.js');

// test middleware
var reqUtc = (req, res, next) => {
  req.utc = new Date();
  next();
}

router.use(reqUtc);

//++++++++++++++
//HOME PAGE DISPLAY ALL EXPENSES
//++++++++++++++
router.get('/', function(req, res) {
  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/finance';

  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Error establishing connection to server. Returned with err: ', err);
    } else {
      var collection = db.collection('revenuesTest');

      collection.find().sort({
        date: -1
      }).toArray(function(err, result) {
        if (err) {
          console.log('Err in parsing information at db: ', err);
        } else if (result.length) {

          // Get total
          var total = result
            .map((a) => {
              return parseInt(a['amount']);
            })
            .reduce((a, b) => {
              return a + b;
            });

          // Get objects by date
          var byDate = dbHelpers.divideByDate(result);
          var days = Object.keys(byDate);

          res.render('index', {
            title: 'Expenses',
            expenses: byDate,
            days: days,
            total: total,
            feedback: app.locals.feedback
          });
        } else {
          app.locals.feedback = 'Try the new expense button, yo!';
          res.render('index', {
            title: 'Expenses',
            days: ['No expenses added yet'],
            feedback: app.locals.feedback
          });
        }
        db.close();
      });
    }
  });
});

//++++++++++++++
//NEW EXPENSE
//++++++++++++++
router.get('/new-expense', function(req, res) {
  res.render('new-expense', {
    title: 'New Expense'
  })
});

//++++++++++++++
//DELETE EXPENSE
//++++++++++++++
router.post('/delete', function(req, res) {
  console.log('POST request of delete type sent.');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/finance';

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
})

//++++++++++++++
// ADD'S EXPENSE
//++++++++++++++
router.post('/add-expense', function(req, res) {
  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/finance';

  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log('Couldn\'t connect to db: ', err);
    } else {
      console.log('Connected to db to create data.');

      var collection = db.collection('expensesTest');
      var expense = {
        amount: parseInt(req.body['add-amount']),
        description: req.body['add-description'],
        category: req.body['add-category'],
        date: new Date()
      }
      collection.insertOne(expense, function(err, result) {
        if (err) {
          console.log('Problem writing to db: ', err);
        } else {
          console.log('Write successful with: ', result)
          app.locals.feedback = "Added successfully!";
          res.redirect('/');
        }
        db.close();
      });
    }
  });
});


//+++++++++++++++++
//DATABASE API TEST
//+++++++++++++++++
router.get('/expenses/api', function(req, res) {
  console.log(req.url);
});

app.get(/down.{1,5}/, function(req, res) {
  res.download('/images/grandpasimpson.jpg')
});

module.exports = router;