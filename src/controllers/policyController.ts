import Policy from '../models/policy';
import moment from 'moment';
import logger from '../util/logger';

/**
 * @description all controllers related to policy lives here
 */

export const createPolicy = async (user_id, policies: string[]) => {
	try {
		const found = await Policy.findOne({ user: user_id }).exec();
		if (found) {
			throw new Error('User has already created policy. Update instead');
		}
		const createdAt = await moment().format('DD MM YYYY hh:mm:ss');
		const user = await user_id;
		const userPolicy = await new Policy({
			user,
			createdAt,
			policies
		});
		await userPolicy.save();
	} catch (e) {
		logger.error(e.message);
		throw new Error(e.message);
	}
};

export const getUserPolicy = async (user_id) => {
	try {
		const userPolicy = await Policy.getPolicyByUser(user_id);
		return userPolicy.policies;
	} catch (e) {
		logger.error(e.message);
		throw new Error(e.message);
	}
};

export const updateUserPolicy = async (user_id: string, policy: string[]) => {
	try {
		const userPolicy = await Policy.getPolicyByUser(user_id);
		const updatedPolicy = await userPolicy.policies.concat(policy);
		const lastUpdatedAt = await moment().format('DD MM YYYY hh:mm:ss');
		userPolicy.policies = await updatedPolicy;
		userPolicy.lastUpdatedAt = await lastUpdatedAt;
		await userPolicy.save();
	} catch (e) {
		logger.error(e.message);
		throw new Error('Could not update policy for this user');
	}
};

/**
 * @todo write query to count and return all the unique values in the policy collection
 * @todo consider moving the policy colectiont to a seperate database and writ custom cluster config
 * for access  
 * @description for this is simple solution. This could also be potentially slow with increased number of user. 
 * I would come back and optimise the query or model the data differently. 
 */
export const allPolicy = async () => {
	try {
		const mypoly = await Policy.find({}, { createdAt: 0, lastUpdatedAt: 0, user: 0, _id: 0, __v: 0 });
		let flat: string[] = [];
		await mypoly.forEach((doc) => (flat = flat.concat(doc.policies)));
		const policyCount = await countPolicies(flat);
		return policyCount;
	} catch (e) {
		logger.error(e.message);
		throw new Error('Internal server Error');
	}
};

export const countPolicies = async function(params: string[]) {
	try {
		let count = {};
		for (let i of params) {
			count[i] ? count[i]++ : (count[i] = 1);
		}
		return count;
	} catch (e) {
		logger.error(e.message);
		throw new Error('Internal Server Error');
	}
};
