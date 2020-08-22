import Policy from '../models/policy';

export interface IUser {
	email: string;
	username: string;
}

export interface ILogin {
	email: string;
	password: string;
}

export interface ISignup {
	username: string;
	email: string;
	password: string;
}

export interface Itoken {
	id: string;
	access: string;
}

export interface IPayload {
	id: string;
	access: string;
	iat: number;
	exp: number;
}
