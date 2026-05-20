import UserModel from "../models/UserModel.js";

const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.userId) {
                return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
            }

            const user = await UserModel.findById(req.userId);
            if (!user) {
                return res.status(401).json({ success: false, message: "Unauthorized: User not found in DB" });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ success: false, message: "Access Denied: Insufficient Permissions" });
            }
            
            // Attach user to req for downstream use if needed
            req.user = user;
            next();
        } catch (error) {
            console.error("Role Middleware Error:", error);
            res.status(500).json({ success: false, message: "Server error during role check" });
        }
    };
};


export default checkRole;
