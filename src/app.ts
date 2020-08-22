import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import config from './config/index';
import routes from './routes'
import connectDB from './db';
import logger from './util/logger';

const startApp = async () => {
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100
	});
	connectDB();
	const app = express();
	app.use(express.json());
	app.use(helmet());
	app.use(limiter);
	app.use('/api', routes)

	app.listen(config.PORT, () => {
		logger.info(`server up and running on port ${config.PORT}`);
	});
};
export default startApp;
