import express from 'express';
import path from 'path';

const router = express.Router();
import createError from 'http-errors';
import validator from 'validator';

const browser = async function(req, res, next) {

  if(!req.session.username) return res.redirect('/account/login');


  // const US = await req.Cosmopolis.models.Group.create({ name: "United States" });
  // await US.reload();

  //Model.findAll({ name: "United States" });
  // const us = await req.Cosmopolis.models.Group.findOne({ where: { name: "United States" } });
  // const mv = await req.Cosmopolis.models.Group.findOne({ where: { name: "Multiverse" },   });
  //
  //
  // console.log(us);
  // console.log(us.description);
  //
  // const links =  await mv.getLinks();
  // console.log(links);


  const {Group, User} = req.app.get('models');

  const { username } = req.session;
  const user = await User.findOne({where:{ username }});

  const { id } = req.params;
  let group;
  console.log('\n\n\nreq.params.id', id);
  console.log(id);

  if( req.params.id ){
    console.log('SEARCH BY ID (%s)',id);
    group = await Group.findOne({where:{ id }});

  }else{
    console.log('SEARCH BY ROOT');
    group = await Group.findOne({where:{ root: true }});
  }

  const links =  await group.getLinks();
  const users =  await group.getUsers();


  console.log('USER COUNT AFTER ADDING', await group.countUsers());

  if(group.root){
    req.session.groupPath = []
  }else{
    let newPath = [];
    for(let fragment of req.session.groupPath){
      if(fragment.id == group.id) break;
      newPath.push(fragment);
    }
    // const count = req.session.groupPath.filter(i=>i.id==group.id).length;
    req.session.groupPath = newPath;
    req.session.groupPath.push({id: group.id, name: group.name})
  }


  const context = {
    title: 'Cosmopolis Groups: The Structure of Our Universe',
    account: req.session.account,

    group: {
      id: group.id,
      root: group.root,
      name:  group.name,
      description: group.description,
      member: await group.hasUser(user),
      links: links.map(({id, name, description})=>({id, name, description})),
      users: users.map(({id, username})=>({id, username})),
      path: req.session.groupPath
    }
  };



  res.render('group', context);
  console.log(context.group);

}

router.get('/', browser);
router.get('/:id', browser);

// router.get('/join', async function(req, res, next) {
//   return next(createError(501));
// }

router.post('/join', async function(req, res, next) {

  const { id } = req.body;
  if(!validator.isInt(id)) return res.redirect('/group');
  const { username } = req.session;
  const { Group, User } = req.app.get('models');

  const user = await User.findOne({where:{ username }});
  const group = await Group.findOne({where:{ id }});

  await group.addUser(user);
  await group.save();
  console.log(group);
  console.log('%s: USERS AFTER ADDING', id, await group.getUsers());
  console.log('%s: USER COUNT AFTER ADDING', id, await group.countUsers());



  res.redirect(`/group/${id}`);

});

router.post('/leave', async function(req, res, next) {

  const { id } = req.body;
  if(!validator.isInt(id)) return res.redirect('/group');
  const { username } = req.session;
  const { Group, User } = req.app.get('models');

  const user = await User.findOne({where:{ username }});
  const group = await Group.findOne({where:{ id }});

  await group.removeUser(user);
  await group.save();
  console.log(group);
  console.log('%s: USERS AFTER ADDING', id, await group.getUsers());
  console.log('%s: USER COUNT AFTER ADDING', id, await group.countUsers());



  res.redirect(`/group/${id}`);

});

export default router;
