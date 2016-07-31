var express = require('express')
var app = express()
var router = express.Router()

var addCategory = require('../models/category-schema.js');

//++++++++++++++
//NEW CATEGORY
//++++++++++++++
router.post('/add-category', (req, res) => {
  addCategory(req.body);
  res.sendStatus(200);
});

module.exports = router;