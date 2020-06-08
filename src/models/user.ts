import {Schema, Document, model} from 'mongoose';
import validator from 'validator';

import {IUser} from '../interfaces/index'


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value:string):boolean => validator.isEmail(value),
            message: 'Invalid Email'
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    

    // if isssues are predifined, add some custome validation here.
    issues:{
        type: Array,
        required: false,
        default: []

    }

});

UserSchema.methods.getIssues = async function(){
    try{
        const userIssues: string[] = this.issues;
        return userIssues
        
    }catch(e){
        throw new Error('Unable to get Isuues for this particular user');
    }
}

const User = model('User', UserSchema);

export default User