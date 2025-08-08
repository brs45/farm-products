const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.SECRET_JWT;

const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token. Unauthorized" });
    }

    const decoded = jwt.verify(token, secret);

    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;



