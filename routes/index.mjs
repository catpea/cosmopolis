import express from 'express';
const router = express.Router();

router.get('/', function(req, res, next) {

  const context = {
    title: 'Cosmopolis Reference Implementation'
  };

  res.render('index', context);
});

export default router;
