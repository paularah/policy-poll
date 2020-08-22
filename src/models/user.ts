import { Schema, Document, Model, model } from 'mongoose';
import validator from 'validator';
import createToken from '../services/TokenAuth';
import bcrypt from 'bcrypt';

import logger from '../util/logger';

interface IUserDocument extends Document {
	username: string;
	email: string;
	password: string;
	generateAuthToken: () => Promise<string>;
	validatePassword: (oldPassword: string) => Promise<void>;
}

interface IUserModel extends Model<IUserDocument> {
	findByCredentials: (email: string, password: string) => Promise<IUserDocument>;
}

const UserSchema = new Schema({
	username: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate: {
			validator: (value: string): boolean => validator.isEmail(value),
			message: 'Invalid Email'
		}
	},

	password: {
		type: String,
		required: true,
		minlength: 6
	}
});

UserSchema.pre<IUserDocument>('save', async function(next) {
	try {
		const user = await this;
		if (user.isModified('password')) {
			const hash = await bcrypt.hash(user.password, 10);
			user.password = await hash;
		}
		next();
	} catch (e) {
		logger.error(e.message);
		throw new Error(``);
	}
});

UserSchema.methods.generateAuthToken = async function<IUserModel>() {
	try {
		const id: string = this._id.toHexString();
		const access: string = 'auth';
		const token: string = await createToken(id, access);
		await this.save();
		return token;
	} catch (e) {
		logger.error(`${e.message}`);
		throw new Error(`Unable to generate token`);
	}
};

UserSchema.methods.validatePassword = async function<IUserModel>(oldPassword) {
	try {
		const hash = await bcrypt.hash(oldPassword, 10);
		if (this.password !== hash) {
			throw new Error('Incorrect Password');
		}
	} catch (e) {
		throw new Error(e.message);
	}
};

UserSchema.statics.findByCredentials = async function(email, password) {
	try {
		const user = await this.findOne({ email: email }).catch((e) => {
			throw new Error('Could not find a user with email');
		});
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			throw new Error('Incorrect Password');
		}
		return user;
	} catch (e) {
		throw Error(e.message);
	}
};

const User: IUserModel = model<IUserDocument, IUserModel>('User', UserSchema);

export default User;
