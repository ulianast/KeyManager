'use strict';

import express from 'express';
import path from 'path';
import helmet from 'helmet';
//var config = require('config');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
//import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
//import session from 'express-session';
//import getRedisStore = from('connect-redis');
import getPassport from './server/utils/passport';
//import config from './config';

import authRoutes from './server/routes/auth';
import mustAuthenticate from './server/middleware/mustAuthenticated';
import mustHavePermissions from './server/middleware/mustHavePermissions';

import userRoutes from './server/routes/users';
import codesRoutes from './server/routes/codes';
import activationRoutes from './server/routes/activation';
//import forceSSL from 'express-force-ssl';
// var index = require('./routes/index');
//var users = require('./routes/users');

const app = express();
const passport = getPassport();
//const redisStore = getRedisStore(session);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
//app.use(forceSSL);

// app.use(session({ resave: true, // false?
//                   saveUninitialized: true, //false?
//                   secret: config.get('sessionSecret'),
//                   store: redisStore
//               }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.session({ secret: 'SECRET' }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./client/dist/'));

app.use(helmet());

//pass the passport middleware
app.use(passport.initialize());
//app.use(passport.session());

// routes
app.use('/activation', activationRoutes);
app.use('/auth', authRoutes);

app.use('/staffOnly', mustAuthenticate);
app.use('/staffOnly', mustHavePermissions);
app.use('/staffOnly', userRoutes);
app.use('/staffOnly', codesRoutes);
//catch 404 and forward to error handler
// app.use(function(req, res, next) {

//   console.log('req' + req);
//   console.log('res' + res);
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// //error handler
// app.use(function(err, req, res) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
