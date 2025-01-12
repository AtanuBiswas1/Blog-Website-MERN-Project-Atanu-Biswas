// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const protect = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// const admin = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied" });
//   }
//   next();
// };

// module.exports = { protect, admin };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  // console.log(req.headers.authorization)
    const token = req.headers.authorization?.split(" ")[1];
    // console.log(token)
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Verify token
        //console.log(process.env.JWT_SECRET);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded);
        
        // Fetch user and attach to request
        const user = await User.findById(decoded._id).select("-password");
        //console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        res.status(401).json({ message: "Invalid token" });
    }
};

const admin = (req, res, next) => {
  //console.log(req.user)
    if (!req.user) {
        return res.status(500).json({ message: "User not found in request" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }

    next();
};

module.exports = { protect, admin };

