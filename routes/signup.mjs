import express from 'express';
const router = express.Router();

router.get('/', function(req, res, next) {
  const context = {
    title: 'Cosmopolis Signup',
    message: 'Connect with friends and the world around you in virtual Cosmopolis.'
  };
  res.render('signup', context);
});

router.post('/add', async function(req, res, next) {

  const {account, password} = req.body;
  await req.Cosmopolis
  .SignUp({account, password})

});

export default router;
