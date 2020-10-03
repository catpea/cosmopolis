import express from 'express';
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('edit', { title: `Editing ${req.params.id}` });
});

export default router;
