import express from 'express';
const router = express.Router();

router.get('/', async function(req, res, next) {

  await req.Cosmopolis
  .Logout();

});

export default router;
