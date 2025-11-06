import express from 'express';
import { signUpController } from '../controllers/signUp.js';
import rating_system_users from '../model.js';
const signUp = express.Router();
signUp.post("/rating-system", signUpController(rating_system_users));
signUp.post("/catering-service", () => { });
signUp.post("/task-manager", () => { });
export default signUp;
