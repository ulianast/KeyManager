'use strict';

import express from 'express';
import {login} from '../middleware/login';
const router = new express.Router();

router.post('/login', login);

module.exports = router;