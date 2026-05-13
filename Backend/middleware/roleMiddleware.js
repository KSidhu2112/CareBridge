
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Access Denied: Insufficient Permissions" });
        }
        next();
    };
};

export default checkRole;
