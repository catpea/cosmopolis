import path from 'path';

import express from 'express';
import createError from 'http-errors';
import validator from 'validator';
import rateLimit from "express-rate-limit";

const router = express.Router();


const createAccountLimiter = rateLimit({
  windowMs: (1000*60) * 60, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour"
});

router.get('/register', createAccountLimiter, async function(req, res, next) {
  res.render('register', { title: `User Registration`, message: '' });
});

router.post('/register', async function(req, res, next) {

  // HTTP Data //
  const { username, password, email, } = req.body;

  if (!username) return res.redirect('/account/register?missing=true');
  if (!password) return res.redirect('/account/register?missing=true');
  if (!email) return res.redirect('/account/register?missing=true');

  if(!validator.isLength(username, {min:3, max: 128})) return res.redirect('/account/register?invalid=true');
  if(!validator.isLength(password, {min:8, max: 128})) return res.redirect('/account/register?invalid=true');

  if(!validator.isAlphanumeric(username)) return res.redirect('/account/register?invalid=true');
  if(!validator.isEmail(email)) return res.redirect('/account/register?invalid=true');

   // Database //
  const {User} = req.app.get('models');
  const exists = await User.findOne({ where: { username } });
  if (exists) return res.redirect('/account/register?taken=true');

  // Allow Login //
  const user = await User.create({ username, password, email });
  req.session.username = username;
  res.redirect('/');

});




router.get('/login', async function(req, res, next) {
  res.render('login', { title: `User Login`, message: '' });
});

router.post('/login', async function(req, res, next) {

  // HTTP Data //
  const {username, password} = req.body;

  if (!username) return res.redirect('/account/login?missing=true');
  if (!password) return res.redirect('/account/login?missing=true');

  //TODO: bump min to 8
  if(!validator.isLength(username, {min:3, max: 128})) return res.redirect('/account/login?invalid=true');
  if(!validator.isLength(password, {min:3, max: 128})) return res.redirect('/account/login?invalid=true');

  if(!validator.isAlphanumeric(username)) return res.redirect('/account/login?invalid=true');

  // Database //
  const {User} = req.app.get('models');
  const user = await User.findOne({ where: { username } });
  if (!user.password) return res.redirect('/account/login?suspended=true');
  if (!user) return res.redirect('/account/login?retry=true');
  if(user.password != password) return res.redirect('/account/login?retry=true');

  // Allow Login //
  req.session.username = username;
  res.redirect('/');

});




router.get('/logout', async function(req, res, next) {

  req.session.username = null;
  res.redirect('/');

});

router.get('/recover', async function(req, res, next) {

  return next(createError(501));

});

router.get('/terminate', async function(req, res, next) {

  return next(createError(501));

});


export default router;
