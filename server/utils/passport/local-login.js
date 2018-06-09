'use strict';

import {Strategy} from 'passport-local';
import models from '../../dao/models';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import {getLogger} from '../logger';

const log = getLogger(module);

const loginLocalStrategy = new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  function (username, password, done) {
    return models.User.findOne({ 
        where: { login: username }, 
        include: [{
          model: models.Shop, 
          as:'shops',
          attributes: ['id', 'address']
        }]
      })
      .then(user => {
        if (!user) {
          return done(null, false, {message: 'Неверный логин или пароль'});
        }

        user.comparePassword(password, (err, success) => {
          if (err || !success) {
            return done(null, false, {message: `Неверный логин или пароль`});
          }

          const payload = {
            sub: user.id
          };
          // console.log(user);
          // console.log('-------------------------------------------------');
          // console.log(user.shops);
          const token = jwt.sign(payload, config.get('jwtSecret'));
          return done(null, token, 
            { message: 'Вход выполнен успешно', user: user.login, shops: user.shops });
        });       
      })
      .catch(err => {
        log.error('Error while fetching User records from DB: ' + err);
        return done(err, false, {message: `Невозможно чтение из базы данных. Пожалуйста обратитесь в поддержку`});
      });
  }
);

export default loginLocalStrategy;