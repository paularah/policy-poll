import { countPolicies } from '../../src/controllers/policyController';

test('Counts the number of policies in array', async () => {
	const dummyPOlicies = [ 'educAtion', 'education', 'healthcare', 'guns', 'abortion', 'abortion' ];
	const result = await countPolicies(dummyPOlicies);
	expect(result).toEqual({ education: 2, healthcare: 1, guns: 1, abortion: 2 });
});
