import { Request, Response, NextFunction } from 'express';
import { verifyTokenFromHeader } from './ValidateRoutes';
import User from '../models/user';
import { IPayload } from '../interfaces/index';
import logger from '../util/logger';

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const payload: IPayload = await verifyTokenFromHeader(req);
		const user = await User.findOne({ _id: payload.id });
		if (user) {
			req.params.id = payload.id;
			next();
		} else {
			throw new Error('Could not find a user associated with this token');
		}
	} catch (e) {
		logger.error(e.message);
		res.status(400).json({
			success: false,
			error: e.message
		});
	}
};

export default isAuth;
