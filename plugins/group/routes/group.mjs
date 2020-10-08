import express from 'express';
import path from 'path';
const router = express.Router();

router.get('/', async function(req, res, next) {

  await req.Cosmopolis
  .RequireLogin();

  const context = {
    title: 'Cosmopolis Groups: The Structure of Our Universe',
    account: req.session.account,
  };

  res.render('group', context);

});

export default router;
