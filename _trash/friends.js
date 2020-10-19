const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {






  res.render('friends', {
    title: 'Friends',
    message: 'List of users you are following.',
    friends: req.friends.list({account:req.session.account}),
  });


});

module.exports = router;
