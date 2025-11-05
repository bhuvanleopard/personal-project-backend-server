import express from 'express';
import rating_system_users from '../model.js';
import { LoginController } from '../controllers/login.js';

const login = express.Router();

login.get("/rating-system", LoginController(rating_system_users));

login.get("/catering-service", ()=>{});

login.get("/task-manager", ()=>{});

export default login