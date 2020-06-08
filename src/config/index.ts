import dotenv from 'dotenv';
import path from 'path';


interface env {
    DB_CONNECTION:string,
    PORT:number,
}

const envPATH:string = path.resolve(process.cwd(), '../', '../', '.env');
const envFound = dotenv.config({path:envPATH});

// Error handling for the absence of a .env file
if (envFound.error){
    throw new Error(" Could not find a .env file ");
}


let config;
switch(process.env.NODE_ENV){
    
    case "production":
        config = {
            DB_CONNECTION:process.env.CLUSTER_SRV,
            PORT: 5321
        }
        break;

    case "test":
        config = {
            DB_CONNECTION:process.env.TEST_SRV,
            PORT: 5321
        }
        break;

    default:
        config = {
            DB_CONNECTION:"mongodb://127.0.0.1:27017",
            PORT: 3000
        }
    
}

export default config;


