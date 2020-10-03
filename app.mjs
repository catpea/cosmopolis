import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import session from "express-session";
import PouchSession from "session-pouchdb-store";


import indexRouter from './routes/index.mjs';
// import usersRouter from './routes/users.mjs';
// import viewRouter from './routes/view.mjs';
// import editRouter from './routes/edit.mjs';

import cosmopolis from './middleware/cosmopolis/index.mjs';
import databases from './middleware/databases/index.mjs';
import friends from './middleware/friends/index.mjs';
import users from './middleware/friends/index.mjs';

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const sessions = new PouchDB('./data/pouchdb/sessions');
app.use(session({
  secret: '1269a135-f20c-4452-a6a8-d6907edac57e',
  resave: false,
  saveUninitialized: true,
  store : new PouchSession(sessions)
}));


app.use(cosmopolis({}));
app.use(databases({}));
app.use(friends({}));
app.use(users({}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
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

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
