import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// TODO: remove pouch dependency
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);


import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import session from "express-session";
import createError from 'http-errors';
import bodyParser from 'body-parser';
import PouchSession from "session-pouchdb-store";
import rateLimit from "express-rate-limit";


import Models from './models/index.mjs';

import homeApplication from './applications/home/index.mjs';
import accountApplication from './applications/account/index.mjs';
import locationApplication from './applications/location/index.mjs';






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



  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));




  app.use(function(req, res, next) {
    console.log('\n\n\n\n$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#$#\n' + req.url);
    next();
  })

  app.use(function(req, res, next) {
    console.log(req.session);
    res.locals.account = req.session.username?req.session.username:'Anonymous';
    res.locals.account = "XXX";
    next()
  })

  homeApplication(app);
  accountApplication(app);
  locationApplication(app);


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
