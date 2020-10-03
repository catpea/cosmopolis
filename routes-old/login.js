var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const context = {
    title: 'Account Login'
  };
  res.render('login', context);
});

module.exports = router;
