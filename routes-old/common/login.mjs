import express from 'express';
const router = express.Router();

import createError from 'http-errors';

router.get('/', function(req, res, next) {
  const context = {
    title: 'Cosmopolis Login',
    message: 'Connect with friends and the world around you in virtual Cosmopolis.'
  };
  res.render('login', context);
});


router.post('/authenticate', async function(req, res, next) {
  const {account, password} = req.body;
  await req.Cosmopolis
  .SignIn({ account, password });

});

export default router;
