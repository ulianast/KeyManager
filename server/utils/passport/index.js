'use strict';

import passport from 'passport';
import loginLocalStrategy from './local-login.js';

export default function getPassport() { 
    passport.use('local-login', loginLocalStrategy);
    return passport;
}