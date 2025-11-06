import express from 'express';
import cors from 'cors';
import signUp from './app/auth/routes/signUp.js';
import mongoose from 'mongoose';
import login from './app/auth/routes/login.js';
import dotenv from 'dotenv';
import pollRouter from './app/poll/route_poll.js';
dotenv.config();
const db = process.env.MONGO_DB_URL;
async function mongoDB() {
    await mongoose.connect(db);
}
const PORT = Number(process.env.PORT);
const app = express();
app.use(cors());
app.use(express.json());
mongoDB();
app.use("/sign-up", signUp);
app.use("/login", login);
app.use("/rating-system", pollRouter);
app.use((_req, res) => { return res.status(401).json({ msg: 'undefined route' }); });
app.listen(PORT, (err) => {
    if (err)
        return console.log(`server didn't start: ${err}`);
    console.log("server running");
});
