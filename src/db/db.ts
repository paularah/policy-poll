import mongoose from 'mongoose';
import config from '../config/index'

/**
 * @todo 
 * abstract this connection from here to an environmental varaiable 
 */
const connectionString: string = config.DB_CONNECTION 

const connectDB = async ()=>{
    let attempts: number = 5;
    while(attempts){
        try{
        
           await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true} );
            const db = mongoose.connection;
            db.once('open', ()=> console.log('Connected to Database'));
            break;
    
        }catch(e){
            console.log(`Error connecting to db: ${e.message}`)
            attempts --;
            console.log(`Connection attempts left ${attempts}`);
            // waits for 5 seconds before retrying to connect to db
            await new Promise(res => setTimeout(res, 5000))
        }
    }
    

}

export default connectDB();