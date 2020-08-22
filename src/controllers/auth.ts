import User from '../models/user';
import { ISignup } from '../interfaces/index';
import logger from '../util/logger';

/**
 * @description All controllers related to authentication live here. just me keeping data access layer seperate 
 */

export const SignUp = async (body: ISignup) => {
	try {
		const exist = await User.findOne({ email: body.email }).exec();
		if (exist) {
			throw new Error('A user with this email already exists');
		}
		const user = await new User(body);
		const token = await user.generateAuthToken();
		return token;
	} catch (e) {
		logger.error(e.message);
		throw new Error(`${e.message}`);
	}
};

export const login = async (email: string, password: string) => {
	try {
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		return token;
	} catch (e) {
		logger.error(e.message);
		throw new Error(e.message);
	}
};

export const changeUserPassword = async (id, oldPassword: string, newPassword: string) => {
	try {
		const user = await User.findOne({ _id: id }).exec();
		// theoritically I dont see a case where this is possible, that auth middleware
		// takes care of a situation like this. Anyways, Im still going to have this here.
		if (!user) {
			throw new Error('Could find a associated user with this token');
		}
		await user.validatePassword(oldPassword);
		user.password = newPassword;
		user.save();
	} catch (e) {
		logger.error(e.message);
		throw new Error(e.message);
	}
};
