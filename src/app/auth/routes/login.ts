import express from 'express';
import rating_system_users from '../model.js';
import { LoginController } from '../controllers/login.js';

const login = express.Router();

login.post("/rating-system", LoginController(rating_system_users));

login.post("/catering-service", ()=>{});

login.post("/task-manager", ()=>{});

export default login