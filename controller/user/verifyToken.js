require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    try {
      const data = jwt.verify(token, SECRET_KEY);
      req.user = data;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid/Expired token" });
    }
  } else {
    return res.status(403).json({ error: "Token is missing" });
  }
}

module.exports = {verifyToken};
