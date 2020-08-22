import dotenv from 'dotenv';
import path from 'path';

interface env {
	DB_CONNECTION: string | undefined;
	PORT: number | undefined;
}

const envPATH: string = path.resolve(process.cwd(), '.env');
const envFound = dotenv.config({ path: envPATH });
console.log(envPATH);

// Error handling for the absence of a .env file
if (envFound.error) {
	throw new Error(' Could not find a .env file ');
}

/**
 * @todo figure out corect types structuring for prodction 
 * "mongodb://127.0.0.1:27017"
 */

let config;
switch (process.env.NODE_ENV) {
	case 'production':
		config = {
			DB_CONNECTION: process.env.CLUSTER_SRV,
			PORT: process.env.PORT
		};
		break;

	case 'test':
		config = {
			DB_CONNECTION: process.env.TEST_SRV,
			PORT: 5321
		};
		break;

	default:
		config = {
			DB_CONNECTION: process.env.CLUSTER_SRV,
			PORT: 3000,
			level: 'silly',
			JWT_KEY: 'afde5f8c4b8362dc4a7ac492c373097f9de7876847f60fc9eca7e70a4db1a63cc530eb774e6808778d33e3186502c21c0bbaf1e2e61eeff24b40af7ab1215d93';
		}
}


export default config;
