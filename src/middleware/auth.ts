import jwt, {type JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'; dotenv.config();

interface AuthRequest extends Request {

    user: string | JwtPayload

};

const auth = (req: AuthRequest, res: Response, next: NextFunction)=>{

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){

        return res.status(401)
    }

    const token = authHeader.split(" ")[1];

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded
        next();
        
    }catch(err){

        return res.status(400).json({msg: "request failed"})
    }
};

export default auth