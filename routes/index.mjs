import express from 'express';
const router = express.Router();

router.get('/', async function(req, res, next) {

  if(!req.session.username) return res.redirect('/account/login');

  const context = {
    title: 'Cosmopolis Reference Implementation',
  };

  res.render('index', context);

});

export default router;
