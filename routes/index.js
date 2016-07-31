var express = require('express');
var app = express();
var router = express.Router();
var assert = require('assert');
var dateFormat = require('dateformat');
var _ = require('lodash');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;
var url = 'mongodb://localhost:27017/finance';
var mongoose = require('mongoose');
var addCategory = require('../models/category-schema.js');
var Income = require('../models/schema.js');

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

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    aggregateByDate(db, (result) => {

      if (result.length) {
        // Sort results
        var sortedRes = result.sort((day1, day2) => {
          return day2['_id'].monthDay - day1['_id'].monthDay
        });
        // Add some properties like adjusted date and avg hour
        sortedRes.forEach((day) => {
          var offset = new Date().getTimezoneOffset() * 60 * 1000;
          var timeVal = new Date(day['_id'].year, day['_id'].month - 1, day['_id'].monthDay).valueOf();
          day.adjustedDate = dateFormat(timeVal - offset, 'dddd, mmmm dS');
        });

        // Get categories
        db.collection('categories').find({})
          .toArray((err, categories) => {
            if(err)
              console.log(err)

            var tips = ['Drink half a beer today, half tomorrow.','Instead of eating lunch, listen to Wu-Tang','Do not think about beer...','Read a book?','Light up some newspaper shreddings instead of a cigarette!','Just get buck for fun.']
            var randomTip = tips[_.random(0, tips.length - 1)]
            res.render('index', {
              title: 'Save da papuh!',
              protip: randomTip,
              days: sortedRes,
              categories: categories,
              feedback: app.locals.feedback
            });

            db.close();
          })     

      } else {
        app.locals.feedback = 'Try the new expense button, yo!';
        res.render('index', {
          title: 'You keepin\' track?',
          // add dummy object
          days: [{
            test: 'No expenses added yet'
          }],
          feedback: app.locals.feedback
        });

        db.close();
      }
      
    });

  });
});


//expenses



//++++++++++++++
//++++++++++++++
// INCOMES =====
//++++++++++++++
//++++++++++++++

//++++++++++++++
//NEW INCOME
//++++++++++++++
router.post('/income/new', (req, res) => {

  mongoose.connect(url);
  var db = mongoose.connection;
  db.on('error', console.log.bind(console, 'Error connecting to db.'));
  db.once('open', () => {

    var newIncome = new Income(req.body);

    newIncome.save((err, theNewIncome) => {
      assert.equal(null, err)
      console.log(theNewIncome, ' created at ', Date.now())
      res.send(200)
      db.close();
    })

  })
})

//+++++++++++++++++
// INCOMES POST
//+++++++++++++++++
router.post('/incomes', (req, res) => {
  mongoose.connect(url)
  var db = mongoose.connection

  db.on("error", console.log.bind(console, 'Error connecting to db.'))
  db.once('open', () => {
    Income.create(req.body, (err, document) => {
      assert.equal(null, err)

      res.send(document)
    })
  })

})

//+++++++++++++++++
// INCOMES GET
//+++++++++++++++++
router.get('/incomes', (req, res) => {
  mongoose.connect(url)
  var db = mongoose.connection

  db.once('open', () => {
    Income.find({}, (err, incomes) => {
      assert.equal(null, err);

      res.send(incomes)
      db.close()
    })
  })
})

//+++++++++++++++++
// INCOMES GET
//+++++++++++++++++
router.post('/incomes/add', (req, res) => {
  mongoose.connect(url)
  var db = mongoose.connection

  db.once('open', () => {
    var income1 = new Income(req.body)

    income1.save();
    console.log('New income added')
    income1.findThisCategory((err, incomes) => {
      res.send(incomes)
      db.close()
    })

  })
})

//++++++++++
//GET BY category
//++++++++++
router.get('/incomes/api/:cat', (req, res) => {
  var query = req.params.cat

  mongoose.connect(url)
  var db = mongoose.connection
  db.on('err', console.log.bind('error'), console)

  db.once('open', () => {
    Income.find({
      category: query
    }, (err, incomes) => {
      assert.equal(null, err)
      console.log('Incomes request fulfilled.')
      console.log(incomes.length)
      if (incomes.length > 0)
        res.send(incomes)
      else
        res.send('No incomes match this query.')

      db.close()
    })
  })
})


router.get('/expenses/api', function(req, res) {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    db.collection('expensesTest').find({}).toArray((err, result) => {
      assert.equal(null, err);

      res.send(result)
    });
  })
});

app.get(/down.{1,5}/, function(req, res) {
  res.download('/images/grandpasimpson.jpg')
});

module.exports = router;