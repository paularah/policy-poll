import winston from 'winston';

/**
 * @description removes logging during test 
 */
winston.remove(winston.transports.Console);
winston.remove(winston.transports.File);
