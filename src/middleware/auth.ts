import jwt, {type JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
 dotenv.config();

 interface IAuthUser {
   _id: string;
   email: string;
 }
 
 /**
  * Extends the Express Request type to include the authenticated user.
  */
 interface IUserRequest extends Request {
   user?: IAuthUser; // Make user optional to avoid errors if not authenticated
 }
 

const auth = (req: IUserRequest, res: Response, next: NextFunction)=>{

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){

        return res.status(401)
    }

    const token = authHeader.split(" ")[1];

    try{

        const decoded: JwtPayload | string = jwt.verify(token, process.env.JWT_SECRET!);
        const reqBody = req.body;
        req.body = {...reqBody, decoded};

        console.log(decoded);
        req.user = decoded as IAuthUser
        next();
        
    }catch(err){

        return res.status(400).json({msg: "request failed"})
    }
};

export default auth