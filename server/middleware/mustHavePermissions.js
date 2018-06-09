'use strict';
import _ from 'lodash';

export default function mustHavePermissions(req, res, next) {
  if (!req || !req.user || !req.user.role) {
    return res.status(403).end();
  }

  let accessAllowed = false;

  switch(req.user.role) {
    case 'super_admin':
      accessAllowed =
        req.url === '/newStaffUser' || 
        req.url === '/editStaffUser' ||
        req.url === '/shops' || 
        req.url === '/userRoles' ||
        req.url === '/createService' || 
        req.url === '/services' || 
        req.url === '/licences' || 
        req.url === '/activations' ||
        req.url === '/users' ||
        req.url === '/usersStat' ||
        _.startsWith(req.url, '/checkLogin/') ||
        _.startsWith(req.url, '/user/checkPhone/') ||
        _.startsWith(req.url, '/user/') ||
        _.startsWith(req.url, '/checkToken/') ||

        //just for testing
        _.startsWith(req.url, '/generateServiceCode/')
      break;
    case 'admin': 
      accessAllowed = 
        req.url === '/newStaffUser' || 
        req.url === '/editStaffUser' ||
        req.url === '/shops' || 
        req.url === '/userRoles' ||
        req.url === '/activations' ||
        req.url === '/users' ||
        req.url === '/usersStat' ||
        _.startsWith(req.url, '/user/') ||
        _.startsWith(req.url, '/checkToken/')
      break;
    case 'seller':
      accessAllowed = 
        req.url === '/activations' ||
        req.url === '/services' ||
        _.startsWith(req.url, '/user/') ||
        _.startsWith(req.url, '/checkToken/') ||
        _.startsWith(req.url, '/generateServiceCode/')
      break;
    case 'vendor':
      accessAllowed = 
        req.url === '/uploadCodes' || 
        req.url === '/lots' || 
        _.startsWith(req.url, '/user/') ||
        _.startsWith(req.url, '/checkToken/')
      break;
  }

  if (!accessAllowed) {
    return res.status(403).end(); 
  }

  next();
}