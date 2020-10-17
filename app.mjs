import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import helmet from 'helmet';

import session from "express-session";

import createError from 'http-errors';
import bodyParser from 'body-parser';


import PouchSession from "session-pouchdb-store";
import rateLimit from "express-rate-limit";



import Cosmopolis from './cosmopolis/Cosmopolis.mjs';

import indexRouter from './routes/index.mjs';

import accountPlugin from './plugins/account/index.mjs';
// import schoolPlugin from './plugins/school/index.mjs';
// import groupPlugin from './plugins/group/index.mjs';

import locationPlugin from './plugins/location/index.mjs';

import Models from './models/index.mjs';

// import usersRouter from './routes/users.mjs';
// import viewRouter from './routes/view.mjs';
// import editRouter from './routes/edit.mjs';

// import cosmopolis from './middleware/cosmopolis/index.mjs';
// import databases from './middleware/databases/index.mjs';
// import friends from './middleware/friends/index.mjs';
// import users from './middleware/users/index.mjs';




async function main(){




  const app = express();
  app.locals.navigation = [];



  //app.use(helmet.contentSecurityPolicy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());




  // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // see https://expressjs.com/en/guide/behind-proxies.html
  // app.set('trust proxy', 1);
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
  });

  //  apply to all requests
  app.use(limiter);




  app.use(bodyParser.urlencoded({ extended: true }));



  // view engine setup
  app.set('views', [path.join(__dirname, 'views')]);
  app.set('view engine', 'ejs');
  app.set('view options', {
      open: '<?',
      close: '?>'
  });



  const sessions = new PouchDB('./data/pouchdb/sessions');
  app.use(session({
    secret: '1269a135-f20c-4452-a6a8-d6907edac57e',
    resave: false,
    saveUninitialized: true,
    store : new PouchSession(sessions)
  }));





  const models =  await Models();
  app.set('models', models);

  // if(app.get('env') === 'development') console.log('Setting up Cosmopolis...');
  // app.use(function (req, res, next) {
  //   req.Cosmopolis = new Cosmopolis({req, res, next, models, development: req.app.get('env') === 'development'});
  //   next();
  // })




  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));




  app.use(function(req, res, next) {
    res.locals.account = req.session.username?req.session.username:'Anonymous';
    res.locals.account = "XXX";
    next()
  })

  accountPlugin(app);
  locationPlugin(app);

  app.use('/', indexRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.title = 'Error';
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;

}

export default main;
