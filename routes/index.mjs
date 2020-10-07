import express from 'express';
const router = express.Router();

router.get('/', async function(req, res, next) {



  await req.Cosmopolis
  .Help();

  await req.Cosmopolis
  .RequireLogin();

  const context = {
    title: 'Cosmopolis Reference Implementation',
    account: req.session.account,
  };

  res.render('index', context);

});

export default router;
