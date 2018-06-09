'use strict';

import passport from 'passport';
import _ from 'lodash';

export function login(req, res, next) {
  return passport.authenticate(
    'local-login',
    function(err, token, info) {
      if (err) {
        return res.status(404).json({
          success: false,
          message: info ? info.message : ''
        });
      }

      if (token) {
        const shopsData = (info && _.isArray(info.shops)) ? 
          info.shops.map(item => {
            return {
              id: item.id,
              address: item.address
            }
          }) : 
          [];
          
        return res.status(200).json({
          success: true,
          message: info ? info.message : '',
          token: token,
          user: (info && info.user) ? info.user : '',
          shops: shopsData,
        });
      }
      else {
        return res.status(404).json({
          success: false,
          message: info ? info.message : ''
        });
      }
    }
  )(req, res, next);
}

