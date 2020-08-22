import { Model, Schema, model, Document, SchemaTypes } from 'mongoose';
import { string } from 'joi';
import logger from '../util/logger';

interface IPolicyDocument extends Document {
	user: string;
	policies: string[];
	createdAt: string;
	lastUpdatedAt: string;
}

interface IPolicyModel extends Model<IPolicyDocument> {
	getPolicyByUser: (user_id: string) => Promise<IPolicyDocument>;
}

const policySchema = new Schema({
	user: {
		type: SchemaTypes.ObjectId,
		required: true
	},

	policies: {
		type: Array,
		required: false,
		default: []
	},
	lastUpdatedAt: {
		type: String,
		default: null
	},
	createdAt: {
		type: String,
		required: false
	}
});

/**
 * @description returns the polcies for a particular user 
 */

policySchema.statics.getPolicyByUser = async function(user_id) {
	try {
		const doc = await this.findOne({ user: user_id }).exec();
		if (!doc) {
			throw new Error('Could not find a policies this user');
		}
		return doc;
	} catch (e) {
		throw new Error(e.message);
	}
};

/**
 * @description Removes duplicates, trims whitespaces and forces of the values of the input to lowercase
 * @Todo if need arises add some some custom parsing here
 * to ensure homogenounity 
 */
policySchema.pre<IPolicyDocument>('save', async function(next) {
	try {
		if (this.isModified('policies')) {
			const current = this.policies;
			const unique = [ ...new Set(current) ];
			const cleaned = unique.map((elem) => elem.trim().toLowerCase());
			this.policies = cleaned;
			next();
		}
	} catch (e) {
		logger.error(e.message);
		throw new Error('');
	}
});

const Policy: IPolicyModel = model<IPolicyDocument, IPolicyModel>('Policy', policySchema);

export default Policy;
