exports.divideByDate = (arr) => {
  var res = {};
  arr.forEach((obj, i) => {
    var day = obj.date.toDateString().split(' ')[0];
    res[day] = res[day] || {
      expenses: []
    };
    res[day].expenses.push(obj);
  });
  var days = Object.keys(res);
  days.forEach((day) => {

    var total = res[day].expenses
      .map((a) => {
        return a.amount;
      })
      .reduce((a, b) => {
        return parseInt(a) + parseInt(b);
      });
    res[day].total = total;
  });
  return res;
}

exports.createExpense = function(data) {
  var isoDateArr = data['add-date'].split('-').map((a) => {
    return parseInt(a);
  })
  var now = new Date();
  return {
    amount: parseInt(data['add-amount']),
    description: data['add-description'],
    date: new Date(isoDateArr[0], isoDateArr[1] - 1, isoDateArr[2], now.getHours(), now.getMinutes()),
    'date-created': new Date(),
    category: data['add-category']
  }
}