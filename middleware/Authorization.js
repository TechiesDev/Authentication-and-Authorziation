
const jwt = require("jsonwebtoken");
const s_key = process.env.SK


const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; 
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
  
    jwt.verify(token,s_key, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Unauthorized: Invalid token" });
      }
      req.user = decoded;
      next();
    });
  };
  
  module.exports = authenticateToken;