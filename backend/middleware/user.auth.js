

import jwt from "jsonwebtoken";


export const userAuth = async (req, res, next) => {

    const { token } = req.cookies;
    if (!token) {
        return res.json({ success: false, message: "not Authorized Login agin " })
    }
    try {
        const toeknDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (toeknDecode.id) {
            req.body.userId = toeknDecode;
        } else {
            return res.json({ success: false, message: "Not auther se " })
        }

        next();
    } catch (err) {
        res.json({ success: false, message: err.message })
    }


}