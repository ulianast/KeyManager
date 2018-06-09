'use strict';

import winston from 'winston';
const ENV = process.env.NODE_ENV;

export function getLogger(module) {
	
	return new winston.Logger({
		transports: [
			new winston.transports.Console({
				colorize: true,
				level: (ENV === 'development') ?'debug' : 'error',
				label: module.filename
			})
		]
	});
}
