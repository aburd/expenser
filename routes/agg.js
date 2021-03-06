var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/finance';
var ObjectId = require('mongodb').ObjectID;

var aggregateByDate = () => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log('Connection successful.');

    db.collection('expensesTest').aggregate(
      [{
        $group: {
          _id: '$_id',
          expenses: {
            $push: {
              amount: '$amount',
              description: '$description',
              category: '$category',
              date: '$date'
            }
          }
        }
      }]
    ).toArray((err, result) => {
      assert.equal(null, err);
      console.log(result);

      db.close();
    });

  });
}


aggregateByDate();