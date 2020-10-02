var express = require('express');
var router = express.Router();

router.get('/:id', async function(req, res, next) {

  if(req.params.id != req.params.id.replace(/[^a-z0-9_]/g,'')){
    res.render('error', {title:'Error', message: 'Malformed id'});
    return;
  }

  let doc;
  try {
    doc = await req.pouchdb.pages.get(req.params.id);
  } catch (err){
    if (err.name === 'not_found') {
      res.render('alert', {
        title: 'Alert',
        message: 'The id does not yet exist, please create it by visiting the editor.',
        html: '',
        buttons: [
          {
            url:`/edit/${req.params.id}`,
            text:`Edit ${req.params.id}`
          },
          {
            url:`/view/main`,
            text:`Cancel`
          }
        ]
      });
    }else{
      res.render('error', {title:'Error', message: 'Database error: 0eaf89fa-d600-4f28-8a41-7cb8016bcbce'});
    }
    return;
  }

  if(doc){
    const context = Object.assign({}, {title: req.params.id}, doc);
    res.render('index', context);
  }else{
    res.render('error', {title:'Error', message: 'Database error: 8740cc6d-d53c-457e-9f9d-540956213889'});
  }


});

module.exports = router;
