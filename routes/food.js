var express = require('express');

var router = express.Router();

var defineStuff = (req, res, next) => {
  req.pizza = 100;
  req.vegetables = 2;
  next();
}

router.use(defineStuff);

router.get('/pizza', function(req, res) {
  res.send(`This is the pizza page. You have eaten ${req.pizza} pizzas.`);
})

router.get('/vegetables', function(req, res) {
  res.send(`This is the vegetables page. You have eaten ${req.vegetables} vegetables.`);
})

module.exports = router;