const jwt = require('jsonwebtoken');
const config = require('../config.js').get(process.env.NODE_ENV);

const generateJWTToken = (payload, inExpiryTime) => {
  return new Promise((resolve, reject) => {
    try {
      const secretKey = config?.JWTSECRET.JWT;
      let expiryTime = inExpiryTime ? inExpiryTime : config?.JWTSECRET.EXPIRYTIME;

      const token = jwt.sign(payload, secretKey, { expiresIn: expiryTime });

      resolve(token);
    } catch (error) {
      console.error('Error generating token:', error);
      reject(new Error('Error generating token'));
    }
  });
};

module.exports = { generateJWTToken };
