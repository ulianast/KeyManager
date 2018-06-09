import express from 'express';
import models from '../dao/models';
import _ from 'lodash';
import { getLogger } from '../utils/logger';
import { genServiceCodePdfAndPipeToHttp } from '../utils/pdfGenerator';
import { LicenceCodesAlreadyExistError, NotAllLicencesAvailable, ServiceNotFound } from './errors';
import randomstring from 'randomstring';
import fs from 'fs';
import multiparty from 'multiparty';
import util from 'util';

const router = express.Router();
const log = getLogger(module);

/**
 * Route, that is used for saving new licence keys in DB
 * @method POST
 * @name ./upploadCodes
 * @return JSON {error}
 */
router.post('/uploadCodes', (req, res) => {

  if (!req.body || !req.body.data || !req.body.data.length || req.body.data.length === 0) {
    log.error('POST request to /uploadCodes has empty body');
    return res.status(400).json({error: "Данные отсутствуют"});
  } 

  const dataJson = req.body.data;

  
  return models.sequelize.transaction(trans => {
    return models.sequelize.Promise.map(dataJson, (element) => {        
      return models.Licence.findOrCreate({
          where: {
            name: element.name
          },
          transaction: trans
        })
        .spread((licence, created) => {
          return checkLicenceKeysDuplicates(licence, element.codes, trans);
        })
        // .then(licence => {
        //   return checkLicenceKeysDuplicates(licence, element.codes, trans);
        // })
        .then(licence => {        
          return createLicenceLot(licence, element.price, element.codes.length, trans);
        })
        .then(licenceLot => {        
          return insertLicenceKeys(licenceLot, element.codes, trans);
        });
    });
  })
  .then(() => {   
    return res.status(200).end();
  })
  .catch(err => {
    log.error('Error while uploading licence codes: ' + err +
          '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
    return res.status(400).json({error: err.message}); 
  });
});

/**
 * Route, that is used for new service creation in DB
 * @method POST
 * @name ./createService
 * @return JSON {error}
 */
router.post('/createService', (req, res) => {
  const contentType = req.headers['content-type'];
  
  if (contentType && contentType.indexOf('multipart') === 0) {
    const form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      if (err) {
        return res.status(400).json({error: "Невозможно получить данные формы: " + err.message});
      }

      if (!_.isArray(fields.name) || fields.name.length === 0  || !fields.name[0] ||
          !_.isArray(fields.components) || fields.components.length === 0 ||
          !_.isArray(files.files) || files.files.length !== 1) {
        return res.status(400).json({error: "Обязательные данные отсутствуют"});
      }

      fs.readFile(files.files[0].path, (err, data) => {
        if (err) {
          return res.status(400).json({error: "Невозможно загрузить изображение: " + err.message});
        }

        const serviceData = {
          name: fields.name[0].trim(),
          fullPrice: 0,
          photo: new Buffer(data).toString("base64")
        };

        const licencesIds = fields.components;

        return models.sequelize.transaction(trans => {
          return models.Service.create(serviceData, {
            transaction: trans
          })
          .then(service => {
            if (licencesIds.length > 0) {
              return service.setLicences(licencesIds, {transaction: trans})
            }
            else{
              return service;
            }
          })
        })
        .then(() => {  
          return res.status(200).end();
        })
        .catch(err => {
          log.error('Error while creating new service: ' + err +
                '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
          return res.status(400).json({error: err.message}); 
        });
      });   
    });
  }
  else {
    return res.status(400).json({error: "Указан неверный Content-type для формы"});
  }

});

/**
 * Route, that retrives all services 
 * @method GET
 * @name ./services
 * @return JSON {error; services}
 */
router.get('/services', (req, res) => {
  return models.Service.findAll({
      attributes: [
        'id', 'name', 'createdAt',
     //   [models.sequelize.fn('SUM', models.sequelize.col('Licences.price')), 'servicePrice']
      ],
      //includeIgnoreAttributes: false,
      include: [{
        model: models.Licence, 
        as: 'Licences',
        attributes: ['name', 'price'],
        // through: {attributes: []},
      }],
      order : [
        ['name', 'ASC']
      ]
      // group: ['"Service"."id"'],
      // raw: true
    })
    .then(services => {
      const servicesData = !services ? [] :
        services.map(service => {
        let subTotalPrice = 0;

        if (_.isArray(service.Licences)){
          _.forEach(service.Licences, licence => {
            subTotalPrice += licence.price;
          });
        }

        const serviceData = {
          name: service.name,
          id: service.id,
          createdAt: service.createdAt,
          servicePrice: subTotalPrice,
          licences: _.isArray(service.Licences) ?
            service.Licences.map(licence => {
              return {
                name: licence.name,
                price: licence.price
              }
            }) : []
        }

        return serviceData;
      });

      return res.status(200).json({services: servicesData ? servicesData : []});
    })
    .catch(err => {
      log.error('Error while creating new service: ' + err +
        '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
      return res.status(400).json({error: err.message});
    });
});


/**
 * Route, that retrives all licences with non-zero quantity of codes
 * @method GET
 * @name ./licences
 * @return JSON {error; licences}
 */
router.get('/licences', (req, res) => {
  return models.Licence.findAll({
      attributes: [
        'id', 'name', 'price',
        [models.sequelize.fn('SUM', models.sequelize.col('LicenceLots.availableLicences')), 'keysCount']
      ],
      include: [{
        model: models.LicenceLot, 
        as: 'LicenceLots',
        where: {
          availableLicences: {
            [models.sequelize.Op.gt]: 0
          }
        },
        attributes: []
      }],
      group: ['"Licence"."id"']
    })
    .then(licences => {
      return res.status(200).json({licences: licences ? licences : []});
    })
    .catch(err => {
      log.error('Error while creating new service: ' + err +
        '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
      return res.status(400).json({error: err.message});
    });
});

/**
 * Route, that retrives all service lots 
 * @method GET
 * @name ./lots
 * @return JSON {error; lots}
 */
router.get('/lots', (req, res) => {
  return models.LicenceLot.findAll({
      attributes: [
        'number', 'price', 'availableLicences', 'createdAt'
        //[models.sequelize.fn('COUNT', models.sequelize.col('LicenceKeys.id')), 'keysCount']
      ],
      include: [
        {
          model: models.Licence,
          as: 'Licence',
          attributes: ['name']
        },
        {
          model: models.LicenceKey, 
          as: 'LicenceKeys',
          attributes: ['id']
        }
      ],
      order: [['createdAt', 'DESC']]
    })
    .then(lots => {
      const lotsData = lots.map(lot => {
        return {
          number: lot.number,
          price: lot.price,
          availableLicences: lot.availableLicences,
          createdAt: lot.createdAt,
          totalLicences: _.isArray(lot.LicenceKeys) ? lot.LicenceKeys.length : 0,
          licence: lot.Licence ? lot.Licence.name : ''
        }
      });

      return res.status(200).json({ lots: lotsData });
    })
    .catch(err => {
      log.error('Error while creating new service: ' + err +
        '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
      return res.status(400).json({error: err.message});
    });
});

/**
 * Route, that retrives all activations 
 * @method GET
 * @name ./activations
 * @return JSON {error; activations}
 */
router.get('/activations', (req, res) => {
  const requestUser = req.user;
  const staffUserRequestOptions = {
    model: models.User, 
    as: 'StaffUser',
    attributes: ['login']
  };

  const shopUserRequestOptions = {
    model: models.Shop, 
    as: 'Shop',
    attributes: ['address']
  };

  if (requestUser.role === 'admin') {
    const requestUserShopId = (_.isArray(requestUser.shops) && requestUser.shops.length === 1) ?
      requestUser.shops[0].id:
      INVALID_ID;
    shopUserRequestOptions.where = {id: requestUserShopId};
  }
  else if (requestUser.role === 'seller') {
    staffUserRequestOptions.where = {id: requestUser.id};
  }

  return models.UserCode.findAll({
      include: [
        {
          model: models.Client, 
          as: 'Client',
          attributes: ['phone']
        },
        {
          model: models.Service, 
          as: 'Service',
          attributes: ['name']
        },
        staffUserRequestOptions,
        shopUserRequestOptions
      ],
      order : [
        ['createdAt', 'DESC']
      ]
    })
    .then(userCodes => {
      const activationsData = !userCodes ? 
        [] :
        userCodes.map(userCode => {
          let actCode = userCode.code;

          if (actCode.length && actCode.length === 16) {
            const part1 = actCode.substring(0,4);
            const part2 = actCode.substring(4,8);
            const part3 = actCode.substring(8,12);
            const part4 = actCode.substring(12,16);

            actCode = `${part1}-${part2}-${part3}-${part4}`;
          }

          return {
            code: actCode,
            service: (userCode.Service && userCode.Service.name) ? userCode.Service.name : '',
            createdAt: userCode.createdAt,
            activatedAt: userCode.activatedAt,         
            staffUser: (userCode.StaffUser && userCode.StaffUser.login) ? userCode.StaffUser.login : '',
            client: (userCode.Client && userCode.Client.phone) ? userCode.Client.phone : '',
            shop: (userCode.Shop && userCode.Shop.address) ? userCode.Shop.address : ''
          }
        });

      return res.status(200).json({activations: activationsData});
    })
    .catch(err => {
      log.error('Error while fetching activations: ' + err +
        '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
      return res.status(400).json({error: err.message});
    });
});

/**
 * Route, that retrives generated PDF for purchased service pack
 * @method GET
 * @name ./pdf/:serviceCode
 * @return stream 
 */
router.get('/pdf/:serviceCode', (req, res) => {
  // if (!req.params.serviceCode) {
  //   return res.status(400);
  // }

  // const filename = 'test.pdf';

  // res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
  // res.setHeader('Content-type', 'application/pdf')
  genServiceCodePdfAndPipeToHttp(res, req.params.serviceCode);

  //return res;
});

/**
 * Route, that generate service code, that can be used to receive licences activation code
 * @method GET
 * @name ./generateServiceCode/:serviceId
 * @return stream 
 */
router.get('/generateServiceCode/:serviceId/:shopId', (req, res) => {
  if (!req.params.serviceId || !req.user || !req.user.id) {
    return res.status(400);
  }

  const userCodeData = {
    code : randomstring.generate({
        length: 16,
        charset: 'alphanumeric',
        capitalization : 'uppercase'
      }),
    ServiceId : req.params.serviceId,
    StaffUserId : req.user.id,
    ShopId: req.params.shopId ? req.params.shopId : null
  }

  let userCode = null;

  return models.sequelize.transaction(trans => {
    return models.UserCode.create(userCodeData, {
      transaction: trans
    })
    .then(createdUserCode => {
      userCode = createdUserCode;
      return fetchServiceWithLicenceLots(req.params.serviceId, trans);
    })
    .then(service => {
      const licenceLotIds = [];  
      _.forEach(service.Licences, licence => {
        _.forEach(licence.LicenceLots, licenceLot => {
          licenceLotIds.push(licenceLot.id);
        })
      });

      if (licenceLotIds.length !== service.Licences.length) {
        throw new NotAllLicencesAvailable();
      }

      return models.sequelize.Promise.map(licenceLotIds, (licenceLotId) => { 
        return models.LicenceKey.findOne({
          transaction : trans,
          where : {
            LicenceLotId : licenceLotId,
            used: false
          },
          order : [
            ['createdAt', 'ASC']
          ],
          limit: 1
        })
        .then(licenceKey => {
          return licenceKey.update({used : true, UserCodeId : userCode.id}, {
            transaction : trans,
            individualHooks: true,
          })
        })        
      })
      .then(result => {
        if (!result || result.length !== licenceLotIds.length) {
          throw new NotAllLicencesAvailable();
        }
      }) 
    })
  })
  .then(() => {
    return res.status(200).json({code: userCode.code});
  }) 
  .catch(err => {
    log.error('Error while creating new service: ' + err +
        '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
    return res.status(400).json({error: err.message});
  });
});


function fetchServiceWithLicenceLots(serviceId, trans) {
  return models.Service.findAll({
    where: {
      id : serviceId
    },
    transaction: trans,
    include: [{
      model: models.Licence, 
      as: 'Licences',
      include: [{
        model: models.LicenceLot, 
        as: 'LicenceLots',
        where: {
          availableLicences: {
            [models.sequelize.Op.gt]: 0
          }
        },
        order: [
          ['createdAt', 'ASC']
        ],
        limit: 1
      }]
    }],
  })
  .then(services => {
    if (services && services.length) {
      return services[0];
    }
    else {
      throw new ServiceNotFound();
    }
  });
}

function insertLicenceKeys(licenceLot, licenceKeysCodes, trans) {
  const licenceKeys = licenceKeysCodes.map(item => {
    const objectItem = {
      code: item,
      LicenceLotId: licenceLot.id
    }
    return objectItem;
  });

  const queryOptions = {
    transaction: trans,
    individualHooks: true,
    validate: true
  };

  return models.LicenceKey
    .bulkCreate(licenceKeys, queryOptions);
}

function createLicenceLot(licence, price, keysCount, trans) {
  const licenceLotData = {
    price: price,
    LicenceId: licence.id,
    number: 0,
    availableLicences: _.isNumber(keysCount) ? keysCount : 0
  };

  return models.LicenceLot
    .create(licenceLotData, {transaction: trans});
}

function checkLicenceKeysDuplicates(licence, licenceKeysCodes, trans) {
  return models.LicenceLot
    .findAll({
      where: {
        LicenceId: licence.id
      },
      include: [{
        model: models.LicenceKey, 
        as: 'LicenceKeys',
        where: {
          used: false,
          code: {
            [models.sequelize.Op.in]: licenceKeysCodes
          }
        },
        attributes: ['code']
      }],
      transaction: trans
    })
    .then(foundLicenceLots => {     
      _.forEach(foundLicenceLots, value => {
        if (value && value.LicenceKeys && value.LicenceKeys.length && value.LicenceKeys.length > 0) {
          const duplicateCodes = value.LicenceKeys.map(item => {return item.code;});
          throw new LicenceCodesAlreadyExistError(null,  duplicateCodes);
        }
      }); 

      //licence.lotsCount = foundLicenceLots.length ? foundLicenceLots.length : 0;
      return licence;
    });
}


module.exports = router;