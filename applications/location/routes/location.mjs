import express from 'express';
import path from 'path';

const router = express.Router();
import createError from 'http-errors';
import validator from 'validator';

const browser = async function(req, res, next) {

  if(!req.session.username) return res.redirect('/account/login');




  const {Location, User} = req.app.get('models');

  const { username } = req.session;
  const user = await User.findOne({where:{ username }});

  const { id } = req.params;
  let location;
  console.log('\n\n\nreq.params.id', id);
  console.log(id);

  if( req.params.id ){
    console.log('SEARCH BY ID (%s)',id);
    location = await Location.findOne({where:{ id }});

  }else{
    console.log('SEARCH BY ROOT');
    location = await Location.findOne({where:{ root: true }});
  }

  const locations =  await location.getLinks();
  const things =  await location.getThings();
  for(let thing of things){
    thing.actions = await thing.getActions();
  }
  const users =  []; //await location.getUsers();





  const context = {
    title: 'Cosmopolis Locations: The Structure of Our Universe',
    account: req.session.account,

    location: {
      id: location.id,
      root: location.root,
      name:  location.name,
      description: location.description,

      locations: locations.map(({id, name, description})=>({id, name, description})),
      things: things.map(({id, name, description, actions})=>({id, name, description, actions})),
      users: users.map(({id, username})=>({id, username})),
      path: req.session.locationPath
    }
  };



  res.render('location', context);
  console.log(context.location);

}

router.get('/', browser);
router.get('/:id', browser);
router.get('/:id/toolbox', async function(req, res, next) {



  if(!req.session.username) return res.redirect('/account/login');




  const {Location, User} = req.app.get('models');

  const { username } = req.session;
  const user = await User.findOne({where:{ username }});

  const { id } = req.params;
  let location;
  console.log('\n\n\nreq.params.id', id);
  console.log(id);

  if( req.params.id ){
    console.log('SEARCH BY ID (%s)',id);
    location = await Location.findOne({where:{ id }});

  }else{
    console.log('SEARCH BY ROOT');
    location = await Location.findOne({where:{ root: true }});
  }

  const links =  await location.getLinks();
  const users =  []; //await location.getUsers();










  const context = {
    title: 'Cosmopolis Locations: The Structure of Our Universe',
    account: req.session.account,

    location: {
      id: location.id,
      root: location.root,
      name:  location.name,
      description: location.description,

      links: links.map(({id, name, description})=>({id, name, description})),
      users: users.map(({id, username})=>({id, username})),
      path: req.session.locationPath
    }
  };
  res.render('location-toolbox', context);
});



router.post('/join', async function(req, res, next) {

  const { id } = req.body;
  if(!validator.isInt(id)) return res.redirect('/location');
  const { username } = req.session;
  const { Location, User } = req.app.get('models');

  const user = await User.findOne({where:{ username }});
  const location = await Location.findOne({where:{ id }});

  await location.addUser(user);
  await location.save();
  console.log(location);
  console.log('%s: USERS AFTER ADDING', id, await location.getUsers());
  console.log('%s: USER COUNT AFTER ADDING', id, await location.countUsers());



  res.redirect(`/location/${id}`);

});

router.post('/leave', async function(req, res, next) {

  const { id } = req.body;
  if(!validator.isInt(id)) return res.redirect('/location');
  const { username } = req.session;
  const { Location, User } = req.app.get('models');

  const user = await User.findOne({where:{ username }});
  const location = await Location.findOne({where:{ id }});

  await location.removeUser(user);
  await location.save();
  console.log(location);
  console.log('%s: USERS AFTER ADDING', id, await location.getUsers());
  console.log('%s: USER COUNT AFTER ADDING', id, await location.countUsers());



  res.redirect(`/location/${id}`);

});




export default router;
