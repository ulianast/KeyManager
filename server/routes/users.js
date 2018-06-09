import express from 'express';
import models from '../dao/models';
import _ from 'lodash';
import moment from 'moment';
import config from '../../config';
import jwt from 'jsonwebtoken';
import { getLogger } from '../utils/logger';
import { LoginTakenError } from './errors';

const INVALID_ID = -1;

const router = express.Router();
const log = getLogger(module);

/**
 * Route, that retrives user by provided login value
 * @method GET
 * @name ./user/{loginValue}
 * @return JSON {error; user}
 */
router.get('/user/:login', (req, res) => {
  if (!req.params.login) {
    return res.status(400);
  }

  return models.User.findOne({ 
      where: {login: req.params.login},
      attributes: ['fullName', 'login', 'role'],
      include: [{
        model: models.Shop, 
        as:'shops',
        attributes: ['address']
      }] 
    })
    .then((user) => {
      const userData = {
        login: user.login,
        fullName: user.fullName,
        status: models.User.getRoleLabel(user.role),
        role: user.role,
        shops: user.shops.map(item => {
            return item.address;
          })   
      };
      return res.status(200).json({user: userData});
    })
    .catch(err => {
      log.error('Error has occured while quering user from DB. Error: ' + err +
        '\nRequest:' + req.originalUrl +
        '\nRequest Headers: ' + JSON.stringify(req.headers));
      return res.status(400).json({error: err});
    });
});

/**
 * Route, that create new staff user in DB
 * @method POST
 * @name ./newStaffUser
 * @return JSON {error}
 */
router.post('/newStaffUser', (req, res) => {
    
    if (!req.body.username || !req.body.password || !req.body.fullname || !req.body.role || 
      (!req.body.shops && req.body.role !== 'vendor')) {

      return res.status(400).json({error: "Обязательные данные отсутствуют"});
    } 

    const userData = {
      login: req.body.username.trim(),
      password: req.body.password.trim(),
      fullName: req.body.fullname.trim(),
      role: req.body.role.trim()
    };

    let shopsIds = [];

    try {
      if (req.body.shops) {
        shopsIds = JSON.parse(req.body.shops.trim());
      }
    }
    catch(err) {
      return res.status(400).json({error: "Неверный формат данных"});
    } 

    if (shopsIds.length !== 1 && userData.role === 'admin') {
      return res.status(400).json(
        {error: 'Для пользователя с ролью "Администратор сети" должен быть выбран лишь один магазин'});
    }   

    return models.sequelize.transaction(trans => {
      return models.User.findOrCreate({ 
          where: {login: userData.login}, 
          defaults: userData,
          transaction: trans
        })
        .spread((user, created) => {
          if (created) {
            if (shopsIds.length > 0) {
              return user.setShops(shopsIds, {transaction: trans})
              .then(() => { 
                if (user.role === 'admin') {
                  return setUserAsAdmin(user, shopsIds[0], trans);
                }
                else {
                  return user; 
                } 
              })
            }
            else {
              return user;
            }              
          }
          else {
            throw new LoginTakenError();
          }    
        })
    })
    .then(user => {        
      if (user) {
        return res.status(200).end();
      }
      else {
        throw new Error("Неизвестная ошибка");
      }      
    })
    .catch(err => {
      log.error('Error has occured while new user creation. Error: ' + err +
        '\nRequest:' + req.originalUrl +
        '\nRequest Headers: ' + JSON.stringify(req.headers) +
        '\nStackTrace: ' + err.stack);

      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({error: LoginTakenError(), user: null});
      }
      else {
        return {error: err.message, user: null};
      }
    });
});

/**
 * Route, that edit staff user in DB
 * @method POST
 * @name ./editStaffUser
 * @return JSON {error}
 */
router.post('/editStaffUser', (req, res) => {
    
    if (!req.body.id || !req.body.username || !req.body.fullname || !req.body.role || 
      (!req.body.shops && req.body.role !== 'vendor')) {

      return res.status(400).json({error: "Обязательные данные отсутствуют"});
    } 

    const userData = {
      login: req.body.username.trim(),
      //password: req.body.password.trim(),
      fullName: req.body.fullname.trim(),
      role: req.body.role.trim()
    };

    if (req.body.password) {
      userData.password = req.body.password.trim()
    }

    let shopsIds = [];

    try {
      if (req.body.shops) {
        shopsIds = JSON.parse(req.body.shops.trim());
      }
    }
    catch(err) {
      return res.status(400).json({error: "Неверный формат данных"});
    } 

    if (shopsIds.length !== 1 && userData.role === 'admin') {
      return res.status(400).json(
        {error: 'Для пользователя с ролью "Администратор сети" должен быть выбран лишь один магазин'});
    }   

    return models.sequelize.transaction(trans => {
      return models.User.update(userData, { 
          where: {id: req.body.id}, 
          returning: true,
          transaction: trans
        })
        .then(([ rowsUpdate, [updatedUser] ]) => {
          return updatedUser.setShops(shopsIds, {transaction: trans})
          .then(() => { 
            if (updatedUser.role === 'admin') {
              return setUserAsAdmin(updatedUser, shopsIds[0], trans);
            }
            else {
              return updatedUser; 
            } 
          })   
        })
    })
    .then(user => {        
      if (user) {
        return res.status(200).end();
      }
      else {
        throw new Error("Неизвестная ошибка");
      }      
    })
    .catch(err => {
      log.error('Error has occured while new user creation. Error: ' + err +
        '\nRequest:' + req.originalUrl +
        '\nRequest Headers: ' + JSON.stringify(req.headers) +
        '\nStackTrace: ' + err.stack);

      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({error: LoginTakenError(), user: null});
      }
      else {
        return {error: err.message, user: null};
      }
    });
});

/**
 * Route, that checks if user with specified username has already exist
 * @method GET
 * @name ./checkLogin/:val
 * @return JSON {error, exist}
 */
router.get('/checkLogin/:val', (req, res) => {
  if (!req.params.val) {
    return res.status(400);
  }

  return models.User.findOne({ where: {login: req.params.val} })
    .then((user) => {
      const userExist = user !== null;
      return res.status(200).json({exist: userExist});
    })
    .catch(err => {
      log.error('Error has occured while checking login. Error: ' + err +
        '\nRequest:' + req.originalUrl +
        '\nRequest Headers: ' + JSON.stringify(req.headers));
      return res.status(400).json({error: err});
    });
});

/**
 * Route, that checks if user's token is valid
 * @method GET
 * @name ./checkToken/:val
 * @return JSON {error, user}
 */
router.get('/checkToken/:val', (req, res) => {
  if (!req.params.val) {
    return res.status(400).end();
  }
  // get the last part from a authorization header string like "bearer token-value"
  const token = req.params.val;

  return jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
    if (err) { 
      return res.status(400).end(); 
    }

    const userId = decoded.sub;
    return models.User.findById(userId)
      .then((user) => {
        const userData = {
          fullName: user.fullName,
          login: user.login
        }
        res.status(200).json({user: userData});
      })
      .catch(err => {
        log.error('Error has occured while checking token. Error: ' + err +
          '\nRequest:' + req.originalUrl +
          '\nRequest Headers: ' + JSON.stringify(req.headers));
        return res.status(400).json({error: err});
      });
  });
});


/**
 * Route, that retrives all shops
 * @method GET
 * @name ./shops
 * @return JSON {error; shops}
 */
router.get('/shops', (req, res) => {
  const requestUser = req.user;
  const requestOptions = {};

  if (requestUser.role === 'admin') {
    const requestUserShopId = (_.isArray(requestUser.shops) && requestUser.shops.length === 1) ?
      requestUser.shops[0].id:
      INVALID_ID;
    requestOptions.where = {id: requestUserShopId};
  }

  return models.Shop.findAll(requestOptions)
    .then(shops => {
      return res.status(200).json({shops: shops ? shops : []});
    })
    .catch(err => {
      log.error('Error has occured while quering shops. Error: ' + err +
        '\nRequest:' + req.originalUrl +
        '\nRequest Headers: ' + JSON.stringify(req.headers));
      return res.status(400).json({error: err});
    });
});

/**
 * Route, that retrives all shops with sellers and their activations
 * @method GET
 * @name ./usersStat
 * @return JSON {error; shops}
 */
router.get('/usersStat', (req, res) => {
  const requestUser = req.user;
  const requestOptions = { 
    attributes: [ 'address'],
    subQuery: false,
    include: [
      {
        model: models.User, 
        as: 'AdminUser',
        attributes: ['fullName', 'login']
      },
      {
        model: models.User, 
        as: 'users',
        attributes: ['fullName', 'login', 'role'],
        include: [
          {
            model: models.UserCode, 
            as: 'UserCodes',
            attributes: ['createdAt'],
            order : [
              ['createdAt', 'DESC']
            ]
          },
        ]
      },
    ]
  };

  if (requestUser.role === 'admin') {
    const requestUserShopId = (_.isArray(requestUser.shops) && requestUser.shops.length === 1) ?
      requestUser.shops[0].id:
      INVALID_ID;
    requestOptions.where = {id: requestUserShopId};
  }

  return models.Shop.findAll(requestOptions)
  .then(shops => {
    const networksData = shops.map(item => {
      //const startMonthDate = moment().startOf('month');
      const sellers = _.isArray(item.users) ? 
        _.filter(item.users, user => {
          return user.role === 'seller'
        }) : 
        [];

      return {
        name: item.address,
        admin: item.AdminUser,
        users: sellers.map(user => {
          return {
            name: user.fullName,
            login: user.login,
            activations: _.isArray(user.UserCodes) ? user.UserCodes.length : 0
          }
        })
      }
    });

    return res.status(200).json({networks: shops ? networksData : []});
  })
  .catch(err => {
    log.error('Error while fetching users: ' + err +
        '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
    return res.status(400).json({error: err.message});
  });
});

/**
 * Route, that retrives all users
 * @method GET
 * @name ./users
 * @return JSON {error; shops}
 */
router.get('/users', (req, res) => {
  const requestUser = req.user;
  const includeShopsOptions = {
    model: models.Shop, 
    as: 'shops',
    attributes: ['address', 'id']
  };

  if (requestUser.role === 'admin') {
    const requestUserShopId = (_.isArray(requestUser.shops) && requestUser.shops.length === 1) ?
      requestUser.shops[0].id:
      INVALID_ID;
    includeShopsOptions.where = {id: requestUserShopId};
  }

  return models.User.findAll({ 
    attributes: [ 'id', 'fullName', 'login', 'role' ],
    include: [ includeShopsOptions ]
  })
  .then(users => {
    const usersData = users.map(user => {
      return {
        fullName: user.fullName,
        login: user.login,
        role: user.role,
        id: user.id,
        shops: _.isArray(user.shops) ? 
          _.join(
            user.shops.map(shop => {
              return shop.address
            }),
            ', '
          ) : '',
        shopsIds: _.isArray(user.shops) ? 
          user.shops.map(shop => {
            return shop.id
          }) : 
          []
      }
    });

    return res.status(200).json({users: usersData ? usersData : []});
  })
  .catch(err => {
    log.error('Error while fetching users: ' + err +
        '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
    return res.status(400).json({error: err.message});
  });
});

/**
 * Route, that retrives all user roles according to access rules. 
 * Access rules are also defined here. 
 * @method GET
 * @name ./userRoles
 * @return JSON {error; user}
 */
router.get('/userRoles', (req, res) => {
  if (!req.user) {
    log.error("'user' is absent in request. Request: " + req.originalUrl);
    return res.status(400).json({error: "Невозможно получить список ролей. Обратитесь в поддержку."});
  }

  return res.status(200).json(req.user.getRoles());
});

function setUserAsAdmin(user, shopId, trans) {
  return models.Shop.findOne({
    transaction : trans,
    where : {
      id : shopId
    },
  })
  .then(shop => {
    return shop.update({AdminUserId : user.id}, {
      transaction : trans,
    })
  })
  .then(() => {
    return user;
  })
}

module.exports = router;
