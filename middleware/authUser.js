const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const FunctoryFunctions = require('../middleware/factoryFunctions');

const authMiddleware = async (req, res, next) => {
  const responseHandler = new FunctoryFunctions(res); 

  try {

    console.log(req.headers)
    const authorization = req.headers.authorization;
 

    if (!authorization) {
      return responseHandler.responseSend(401, 'Access denied. No token provided.');
    }

    const [, token] = authorization.split(' ');
    console.log(token, "token")
    if (!token) {
      return responseHandler.responseSend(401, 'Access denied. No token provided.');
    }


    const decoded = jwt.verify(token, process.env.SECRET_KEY);


    console.log(decoded, "sdsdsd")
    req.user = {
      userId: mongoose.Types.ObjectId(decoded.userId),
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return responseHandler.responseSend(401, 'Invalid token');
    } else if (err.name === 'TokenExpiredError') {
      return responseHandler.responseSend(401, 'Token expired');
    }
    
    console.error(err);
    return responseHandler.responseSend(500, 'Internal Server Error');
  }
};

module.exports = { authMiddleware };
