import {type Request, type Response} from 'express';
import type { User } from '../types.js';
import type { Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const LoginController = (model:Model<User>)=>{

    return (
    async function(req: Request, res: Response){

        const {email, password} = req.body;

        try{
            

            const isPresent = await model.findOne({email});
            
            if(!isPresent) return res.status(400).send({msg: "invalid try"})
            
            bcrypt.compare(password, isPresent.password, (err, isAuth)=>{

                if(err|| !isAuth){

                    return res.status(400).json({msg: "failed"})
                }
            })

            const token = jwt.sign({

                userId: isPresent._id,
                email: isPresent.email
            }, process.env.JWT_SECRET!, {expiresIn: '2h'} );
            
        return res.status(200).json({msg: "successful", token})

        }catch(err){

            return res.status(400).json({msg: "failed"})
        }
    })

}
