var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const context = {
    title: 'Cosmopolis Reference Implementation'
  };
  res.render('index', context);
});

module.exports = router;
