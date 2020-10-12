import express from 'express';
import path from 'path';


const router = express.Router();
import createError from 'http-errors';
import validator from 'validator';

const paginate = (query, { page, size }) => {
  const offset = page * size;
  const limit = size;
  console.log({offset,limit});
  return {
    ...query,
    offset,
    limit,
    order: [
      ['createdAt', 'ASC']
    ],
  };
};



router.get('/', async function(req, res) {

  let { page, size } = Object.assign({}, { page:0, size:10 }, req.query);
  page = parseInt(page);
  size = parseInt(size);


  console.log('{ page, size }',{ page, size });

  const {School, User} = req.app.get('models');

  const schoolsCount = await School.count();
  const schools = await School.findAll(
    paginate(
      {
        where: {}, // conditions
      },
      { page, size },
    ),
  );

  if(!schools) return res.redirect(`/school`);

  const pages = Math.ceil(schoolsCount/size);
  let previous = page - 1;
  let next = page + 1;
  if(previous<0) previous = pages-1;
  if(next>=pages) next = 0;

  let leaps = [];
  for(let number = page-1; (number >= 0 && leaps.length < 6); number = number - 1){
    leaps.unshift({active:page==number?true:false,number,size})
  }
  for(let number = page; (number < pages && leaps.length < 11); number = number + 1){
    leaps.push({active:page==number?true:false,number,size})
  }
  leaps = leaps.sort((a,b) => a.number - b.number);
  console.log('leaps[0].number', leaps[0].number);
  for(let number = leaps[0].number-1; (number >= 0 && leaps.length < 11); number = number - 1){
    leaps.unshift({active:page==number?true:false,number,size})
  }


  // for(let number = page-1; number > 0; number = number - 1){
  //   leaps.unshift({active:page==number?true:false,number,size})
  // }

  // for(let number = 0; number < page; number = number + 1){
  //   leaps.push({active:page==number?true:false,number,size})
  // }
  //
  // const exists = leaps.filter(l=>l.number==page).length;
  // if(!exists) leaps.push({ active:true, number:page, size})

  leaps = leaps.sort((a,b) => a.number - b.number);

  const context = {
    title: 'Cosmopolis Schools: Future of Our Universe',
    account: req.session.account,
    schools: schools.map(({id, name, description})=>({id, name, description})),
    paginate:{
      leaps,
      previous,
      next,
      size,
    }
  };

    res.render('school-index', context);
});

router.get('/:id', async function(req, res, next) {

  if(!req.session.username) return res.redirect('/account/login');

  const {School, User} = req.app.get('models');

  const { username } = req.session;
  const user = await User.findOne({where:{ username }});

  const { id } = req.params;
  const school = await School.findOne({where:{ id }})

  if(!school) return next(createError(418));

  const books =  await school.getBooks();
  const users =  await school.getUsers();

  const context = {
    title: 'Cosmopolis School: Future of Our Universe',
    account: req.session.account,

    school: {
      id: school.id,
      root: school.root,
      name:  school.name,
      description: school.description,
      member: await school.hasUser(user),
      books: books.map(({id, name, description})=>({id, name, description})),
      users: users.map(({id, username})=>({id, username})),
    }

  };

  res.render('school-home', context);
});

// router.get('/join', async function(req, res, next) {
//   return next(createError(501));
// }

router.post('/join', async function(req, res, next) {

  const { id } = req.body;
  if(!validator.isInt(id)) return res.redirect('/school');
  const { username } = req.session;
  const { School, User } = req.app.get('models');

  const user = await User.findOne({where:{ username }});
  const school = await School.findOne({where:{ id }});

  await school.addUser(user);
  await school.save();
  console.log(school);
  console.log('%s: USERS AFTER ADDING', id, await school.getUsers());
  console.log('%s: USER COUNT AFTER ADDING', id, await school.countUsers());



  res.redirect(`/school/${id}`);

});

router.post('/leave', async function(req, res, next) {

  const { id } = req.body;
  if(!validator.isInt(id)) return res.redirect('/school');
  const { username } = req.session;
  const { School, User } = req.app.get('models');

  const user = await User.findOne({where:{ username }});
  const school = await School.findOne({where:{ id }});

  await school.removeUser(user);
  await school.save();
  console.log(school);
  console.log('%s: USERS AFTER ADDING', id, await school.getUsers());
  console.log('%s: USER COUNT AFTER ADDING', id, await school.countUsers());



  res.redirect(`/school/${id}`);

});

export default router;
