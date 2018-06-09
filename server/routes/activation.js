import express from 'express';
import models from '../dao/models';
import config from '../../config';
import {getLogger} from '../utils/logger';
import axios from 'axios';
import randomstring from 'randomstring';
import _ from 'lodash';

// import {LoginTakenError, ShopsSaveError} from './errors';

const router = express.Router();
const log = getLogger(module);

router.get('/checkPhone/:val', (req, res) => {
  if (!req.params.val) {
    return res.status(400).json({error: 'Поле "телефон" не заполненно'});
  }

  const phone = req.params.val;
  const token = config.get('smsToken');
  const randomCode = randomstring.generate({
    length: 6,
    charset: 'numeric'
  });

  axios.get(`http://sms.unisender.by/api/v1/sendQuickSms?token=${token}&message=${randomCode}&phone=${phone}`,
   {headers: {
      "timeout": 10000, 
    }})
      .then(response => {
        // if (response) {
          return res.status(200).json({code: randomCode});
        // }
        // else {
        //   throw new Error("")
        // }
      })
      .catch(error => {
        let errorMessage = 'Невозможно отправить сообщение.';
        let smsError = '';        

        if (error.resposne.data && error.response.data.error) {
          smsError = error.response.data.error;

          switch (smsError) {
            case 'limit exceeded':
              errorMessage += ' Лимит доступных сообщений исчерпам. Пожалуйста обратитесь в поддержку';
              break;
            case 'incorrect phone number':
              errorMessage += ` Номер телефона ${phone} не валиден. Пожалуйста проверьте введенные данные`;
              break;
          }
        }

        log.error(`Can not send SMS to ${phone} phone number.\nSms.by API response: ${smsError}`);
        return res.status(400).json({error: errorMessage});
      });
});

router.get('/fetchServices/:val', (req, res) => {
  if (!req.params.val) {
    return res.status(400).json({error: 'Обязательные параметры не могут быть пустыми'});
  }

  return models.UserCode.findOne({ 
    where: {code: req.params.val},
    attributes: ['code', 'ClientId'] ,
    include: [{
      model: models.Client, 
      as:'Client',
      attributes: ['phone']
    }]
  })
  .then(userCode => {
    if (userCode) {
      const wherePredicate = [{
        code: req.params.val
      }];

      if (userCode.ClientId) {
        wherePredicate.push({ClientId: userCode.ClientId});
      }

      return models.UserCode.findAll({ 
          where: {[models.sequelize.Op.or]: wherePredicate},
          attributes: ['code'],
          include: [
            {
              model: models.Service, 
              as:'Service',
              attributes: ['name']
            },
            {
              model: models.LicenceKey, 
              as: 'LicenceKeys',
              attributes: ['code'],
              include: [
                {
                  model: models.LicenceLot, 
                  as:'LicenceLot',
                  attributes: ['id'],
                  include: [
                    {
                      model: models.Licence, 
                      as:'Licence',
                      attributes: ['name']                
                    }
                  ]
                }
              ]
            }
          ]
        })
        .then(services => {
          const userPhone = userCode.Client && userCode.Client.phone ? userCode.Client.phone : '';
          return {userPhone, services};
        });
    }
    else {
      return res.status(200).json({exist: false});
    }
  })
  .then(result => {
    const {services, userPhone} = result;

    let servicesData = [];

    if (services && _.isArray(services)) {
      servicesData = services.map(service => {
        return {
          code: service.code,
          name: (service.Service && service.Service.name) ? service.Service.name : '',
          licences: _.isArray(service.LicenceKeys) ? 
            service.LicenceKeys.map(licence => {
              return {
                code: licence.code,
                name: (licence.LicenceLot && licence.LicenceLot.Licence && licence.LicenceLot.Licence.name) ?
                  licence.LicenceLot.Licence.name :
                  ''
              }
            }) :
            []
        }
      });
    }

    return res.status(200).json({services: servicesData, user: userPhone});
  })
  .catch(err => {
    log.error('Error while retrieving User Codes: ' + err +
          '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
    return res.status(400).json({error: err.message}); 
  });
});

router.post('/checkServiceCode/:val', (req, res) => {
  if (!req.params.val) {
    return res.status(400).json({error: 'Код не может быть пустым'});
  }

  return models.UserCode.findOne({ 
    where: {code: req.params.val},
    attributes: ['id', 'code', 'activated'],
    include: [{
      model: models.Service, 
      as:'Service',
      attributes: ['name']
    }] 
  })
  .then(userCode => {
    if (userCode) {
      const codeData = {
        id: userCode.id,
        name: userCode.Service.name,
        code: userCode.code,
        activated: userCode.activated
      };

      return res.status(200).json({exist: true, code: codeData});
    }
    else{
      res.status(200).json({exist: false, code: null});
    }
  })
  .catch(err => {
    log.error('Error while retrieving User Code: ' + err +
          '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
    return res.status(400).json({error: err.message}); 
  });
})

router.post('/activate', (req, res) => {
  if (!req.body.phone || !req.body.serviceCode) {
    return res.status(400).json({error: "Обязательные данные отсутствуют"});
  }

  return models.sequelize.transaction(trans => {
    return models.Client.findOrCreate({ 
      where: {phone: req.body.phone}, 
      transaction: trans
    })
    .spread((user, created) => {
      return models.UserCode.update(
        {
          ClientId: user.id,
          activatedAt: models.Sequelize.fn('NOW'),
          activated: true
        },
        {
          where: {code: req.body.serviceCode},
          transaction: trans
        }
      );
    })
  })
  .then(result => {
    res.status(200).json({success: result ? true : false});
  })
  .catch(err => {
    log.error('Error while activation: ' + err +
          '\nActivationCode:' + req.body.serviceCode +
          '\nRequest:' + req.originalUrl + '\nStack: ' + err.stack);
    return res.status(400).json({error: err.message}); 
  });
})


export default router;