import express from 'express';
import path from 'path';

const router = express.Router();
import createError from 'http-errors';
import validator from 'validator';


router.get('/', async function(req, res, next) {

  if(!req.session.username) return res.redirect('/account/login');

  const context = {
    title: 'Cosmopolis Reference Implementation',
  };

  res.render('home', context);
});



export default router;
