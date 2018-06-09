'use strict';

import jwt from 'jsonwebtoken';
import models from '../dao/models';
import config from '../../config';
import { getLogger } from '../utils/logger';

const log = getLogger(module);

export default function mustAuthenticate(req, res, next){
  if (!req || !req.headers || !req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  return jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;
    return models.User.findById(userId, {
          include: [{
            model: models.Shop, 
            as:'shops',
            attributes: ['id']
          }]
        }
      )
      .then((user) => {
        req.user = user;
        return;
      })
      .then(() => { return next(); })
      .catch(err => {
        log.error('Error while checking auth: ' + err +
          '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
        return res.status(401).json({error: err.message});
      });
  });
}