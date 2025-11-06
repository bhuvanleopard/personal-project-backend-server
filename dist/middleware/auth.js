import jwt, {} from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const reqBody = req.body;
        req.body = { ...reqBody, decoded };
        next();
    }
    catch (err) {
        return res.status(400).json({ msg: "request failed" });
    }
};
export default auth;
