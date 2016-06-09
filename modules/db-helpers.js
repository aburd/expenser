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