import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import sequelizeLibrary from 'sequelize';
const { Sequelize, Model, DataTypes } = sequelizeLibrary;

//const sequelize = new Sequelize('sqlite::memory:');

// CREATE USER cosmopolis WITH PASSWORD '9a917927-f88e-4819-9abb-97c52f56d3b8'; CREATE DATABASE cosmopolis;
// psql -h localhost --username=cosmopolis # this will ask for password
const sequelize = new Sequelize('postgres://cosmopolis:9a917927-f88e-4819-9abb-97c52f56d3b8@localhost:5432/cosmopolis') // Example for postgres

import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import session from "express-session";

import createError from 'http-errors';
import bodyParser from 'body-parser';


import PouchSession from "session-pouchdb-store";


import Cosmopolis from './cosmopolis/Cosmopolis.mjs';

import indexRouter from './routes/index.mjs';
import loginRouter from './routes/login.mjs';
import logoutRouter from './routes/logout.mjs';
import signupRouter from './routes/signup.mjs';

import groupPlugin from './plugins/group/index.mjs';

// import usersRouter from './routes/users.mjs';
// import viewRouter from './routes/view.mjs';
// import editRouter from './routes/edit.mjs';

// import cosmopolis from './middleware/cosmopolis/index.mjs';
// import databases from './middleware/databases/index.mjs';
// import friends from './middleware/friends/index.mjs';
// import users from './middleware/users/index.mjs';




async function main(){




  const app = express();

  // app.request.Cosmopolis = function () {
  //   const cosmopolis = new Cosmopolis(this);
  //   return cosmopolis; // return reference to core
  // }

  app.use(bodyParser.urlencoded({ extended: true }));

  // view engine setup
  app.set('views', [path.join(__dirname, 'views')]);
  app.set('view engine', 'ejs');

  const sessions = new PouchDB('./data/pouchdb/sessions');
  app.use(session({
    secret: '1269a135-f20c-4452-a6a8-d6907edac57e',
    resave: false,
    saveUninitialized: true,
    store : new PouchSession(sessions)
  }));



  class User extends Model {}

  User.init({
    username: DataTypes.STRING,
    birthday: DataTypes.DATE
  }, { sequelize, paranoid: true, modelName: 'user' });

  if(app.get('env') === 'development') console.log('Model synchronization...');
  // await sequelize.sync({ force: true }); // force recreates the table every time
  await sequelize.sync({   }); // force recreates the table every time

    // const jane = await User.create({
    //   username: 'janedoe',
    //   birthday: new Date(1980, 6, 20)
    // });
    // console.log(jane.toJSON());





  const models = {
    User,
  }





  if(app.get('env') === 'development') console.log('Setting up Cosmopolis...');
  app.use(function (req, res, next) {
    req.Cosmopolis = new Cosmopolis({req, res, next, models, development: req.app.get('env') === 'development'});
    next();
  })

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/login', loginRouter);
  app.use('/logout', logoutRouter);
  app.use('/signup', signupRouter);

  groupPlugin(app);

  //
  // app.use('/view', viewRouter);
  // app.use('/edit', editRouter);
  //
  // app.use('/users', usersRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;

}

export default main;
