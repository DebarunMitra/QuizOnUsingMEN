const jwt = require('jsonwebtoken');
const key = require('../config/key').secret;


module.exports = (req, res, next) => {
  //get the token from the header if present
  //console.log(req.headers["token"]);
  const token =req.headers["token"];
  //if no token found, return response (without going to the next middelware)
  if (!token)
    return res.status(401).send("Access denied. Token is not provided")

  try {
    const decoded = jwt.verify(token, key);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid Token')
  }
}
