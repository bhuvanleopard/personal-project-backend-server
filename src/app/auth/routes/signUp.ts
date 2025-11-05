import express from 'express';
import { signUpController } from '../controllers/signUp.js';
import rating_system_users from '../model.js';

const signUp = express.Router();

signUp.get("/rating-system", signUpController(rating_system_users));

signUp.get("/catering-service", ()=>{});

signUp.get("/task-manager", ()=>{});

export default signUp