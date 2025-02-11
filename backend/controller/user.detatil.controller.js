

import { User } from "../model/user.model.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ message: "user required" })
        }
        const user = await User.findById(userId.id);
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }
        return res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerify: user.isAccountVerified,

            }
        });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
}