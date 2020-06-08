import lodash, {Partial} from 'lodash';
import {Request, Response, NextFunction} from 'express'

import {ILogin, ISignup} from '../interfaces/index'



/**
 * @todo check if its req or req.body  
 * @todo decide on validation strategy
 */
const loginValidator = async function(req:Request, res:Response, next:NextFunction){
    try{
        const credentials =  lodash.pick(req, ['email', 'password'])
        next()
    }catch(e){
        throw new Error(`Invalid Input format: ${e}`)
    }
} 

const signupValidator = async function (req:Request, res:Response, next:NextFunction){
    try{
        const  ISignup = lodash.pick(req, ['username', 'email', 'passowrd'])
        next()
    }catch(e){
        throw new Error(`Invalid Input format ${e}`)
    }
}


export default{
    loginValidator,
    signupValidator
}