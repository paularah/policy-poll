import config from '../config/index';
import jsonwebtoken from 'jsonwebtoken';

const createToken = (id: string, access: string) => {
    const unsigned = {
        id,
        access
    }
    const signed = jsonwebtoken.sign(unsigned, config.JWT_KEY, {
        expiresIn: "2 days"
    });
    return signed
}

export default createToken