
import { register, Login, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from "../controller/user.controller.js";
import { userAuth } from "../middleware/user.auth.js";
import { sendVerifyOtp } from "../controller/user.controller.js";

import express from "express";
import { LogOut } from './../controller/user.controller.js';

const Router = express.Router();

Router.route("/register").
    post(register)

Router.route("/login")
    .post(Login)

Router.route("/logout")
    .post(LogOut)

Router.route("/send-verifiy-otp")
    .post(userAuth, sendVerifyOtp)


Router.route("/verify-accound")
    .post(userAuth, verifyEmail)

Router.route("/isAuth")
    .get(userAuth, isAuthenticated)

Router.route("/send-reset-otp")
    .post(sendResetOtp)


Router.route("/reset-password")
    .post(resetPassword)

export default Router;