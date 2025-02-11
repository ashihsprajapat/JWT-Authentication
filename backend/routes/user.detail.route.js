

import express from 'express';
import { userAuth } from './../middleware/user.auth.js';
import { getUserData } from '../controller/user.detatil.controller.js';
const Router = express.Router();

Router.route("/data")
    .get(userAuth, getUserData);


export default Router;
