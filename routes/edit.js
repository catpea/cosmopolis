var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
  res.render('edit', { title: 'Editing '+req.params.id });
});

module.exports = router;
