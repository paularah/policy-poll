import { Request, Response, NextFunction } from 'express';
import joi from '@hapi/joi';
import { verify } from 'jsonwebtoken';

import config from '../config/index';
import logger from '../util/logger';

const JWT_KEY = config.JWT_KEY

/**
 * @description Router level middlewares to validate input to a route.   
 */

export const loginValidator = async function (req: Request, res: Response, next: NextFunction) {
	try {
		const schema = joi.object({
			email: joi.string().email().required(),
			password: joi.string().required()
		});
		await schema.validateAsync(req.body);
		next();
	} catch (e) {
		res
			.status(400)
			.json({
				success: false,
				error: `${e.message}`
			})
			.end();
		logger.error(e.message);
	}
};

export const signupValidator = async function (req: Request, res: Response, next: NextFunction) {
	try {
		const schema = await joi.object({
			username: joi.string().required(),
			email: joi.string().email().required(),
			password: joi.string().required().min(6)
		});
		await schema.validateAsync(req.body);
		next();
	} catch (e) {
		res
			.status(400)
			.json({
				success: false,
				error: e.message
			})
			.end();
		logger.error(e.message);
	}
};

export const validatePolicy = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const schema = await joi.object({
			policy: joi.array()
		});
		await schema.validateAsync(req.body);
		next();
	} catch (e) {
		res
			.status(400)
			.json({
				success: false,
				error: e.message
			})
			.end();
		logger.error(e.message);
	}
};

export const verifyTokenFromHeader = async function (req) {
	try {
		if (
			(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
			(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
		) {
			const payload: any = await verify(req.headers.authorization.split(' ')[1], JWT_KEY);
			return payload;
		}
		//   throw new Error('Token not specified correctly in the header')
	} catch (e) {
		throw new Error(e.message);
	}
};

export const validatePasswordChange = async function (req: Request, res: Response, next: NextFunction) {
	try {
		const schema = await joi.object({
			oldPassword: joi.string().required(),
			newPassword: joi.string().required()
		});
		await schema.validateAsync(req.body);
		next();
	} catch (e) {
		res
			.status(400)
			.json({
				success: false,
				error: e.message
			})
			.end();
		logger.error(e.message);
	}
};
