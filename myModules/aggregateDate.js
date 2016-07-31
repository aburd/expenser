var assert = require('assert');

var aggregateByDate = (db, callback) => {

  db.collection('expensesTest').aggregate(
    [{
      $group: {
        _id: {
          monthDay: {
            $dayOfMonth: '$date'
          },
          month: {
            $month: '$date'
          },
          year: {
            $year: '$date'
          }
        },
        total: {
          $sum: '$amount'
        },
        expenses: {
          $push: {
            amount: '$amount',
            description: '$description',
            category: '$category',
            date: '$date',
            'date-created': '$date-created',
            theId: '$_id'
          }
        }
      }
    }]
  ).toArray((err, result) => {
    assert.equal(null, err);
    callback(result);
  });
}

module.exports = aggregateByDate;