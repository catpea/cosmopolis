var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const context = {
    title: 'Account Recovery'
  };
  res.render('recovery', context);
});

module.exports = router;
