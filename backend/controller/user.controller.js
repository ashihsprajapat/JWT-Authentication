
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import nodemailer from "nodemailer";
import { text } from "express";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "email or password required", success: false })
    }

    try {
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "email already exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashPassword,
        })

        await newUser.save()

        let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie('toekn', token, {
            httpsOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOpetions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Registration to my website",
            text: ` Welcom to my website . Your account has been created with email id ${email}`
        }

        transporter.sendMail(mailOpetions, (error, emailResponse) => {
            if (error)
                return res.status(400).json({ error: error })

            res.json({ message: emailResponse })

        })
        return res.status(200).json({ message: "register successfull", success: true })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}


export const Login = async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "email or password required" })
    }

    try {

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "Invalid email " })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.json({ success: false, message: "Invalid password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ message: "login SuccessFul", success: true })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

export const LogOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpsOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            secure: process.env.NODE_ENV === "production",

        })
        return res.status(200).json({ success: true, message: "Logout successfull" })

    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }
}


export const sendVerifyOtp = async (req, res) => {
    try {
        console.log("request com to send verify Otp")
        const { userId } = req.body;
        const user = await User.findById(userId.id);

        if (user.isAccountVerified) {
            return res.status(200).json({ success: false, message: "Account already verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Verification Otp",
            text: `Your OTP is ${otp} . verify your account using this OTP`
        }
        transporter.sendMail(mailOption, (error, emailResponse) => {
            if (error)
                return res.status(400).json({ error: error })

            res.json({ message: emailResponse })

        })


        return res.json({ success: true, message: "verification otp is send" })

    } catch (err) {
        res.status(400).json({ success: false, message: err.message })

    }

}



export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.json({ message: "email or otp required", success: false })
    }
    try {
        const user = await User.findById(userId.id);
        
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "invalid Otp" })
        }

        if (user.verifyOtpExpireAt < Date.now) {
            return res.json({ success: false, message: "otp expired" })
        }


        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;

        await user.save()
        return res.json({ success: true, message: "Email varified" })

    } catch (err) {
        return res.status(400).json({success:true,message:err.message});
    }


}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true })

    } catch (er) {
        res.json({ success: false, message: er.message })
    }
}

//send password reset otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({
            success: false, message: "email is required"
        })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false, message: "user not found"
            })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset Otp",
            text: `Your OTP for resetting your password is ${otp}. Use  this OTP to proceed with resetting your password`
        }

        await transporter.sendMail(mailOption);

        return res.json({
            success: true, message: "Otp send to your email"
        })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}



export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, menubar: "Email, OTP abd new password are required" })
    }

    try {

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid otp" })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "Expired otp" })
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "password hash been reset successfully " })

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}