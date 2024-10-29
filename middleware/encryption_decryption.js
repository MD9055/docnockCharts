const CryptoJS = require('crypto-js');

const secretKey = 'emr_2024'; // Replace with your secret key
const iv = '1234567890123456'; // Replace with your initialization vector

/**
 * Decrypts data encrypted with AES-256-CBC.
 * 
 * @param {string} encryptedData - Encrypted data in hexadecimal format.
 * @param {string} secretKey - Secret key used for decryption.
 * @returns {string|null} Decrypted data or null if decryption fails.
 */
function decryptData(encryptedData, secretKey) {
  try {
    // Parse encrypted data from hexadecimal
    const encryptedBytes = CryptoJS.enc.Hex.parse(encryptedData);

    // Create AES-256-CBC decipher
    const decipher = CryptoJS.AES.decrypt({
      ciphertext: encryptedBytes,
      passphrase: secretKey,
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert decrypted data to UTF-8 string
    return decipher.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
}

/**
 * Express middleware for decrypting request bodies.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const decryptMiddleware = (req, res, next) => {
  try {
    const encryptedBody = req.body.payload;
    console.log(encryptedBody, "test");

    if (encryptedBody) {
      const decryptedBody = decryptData(encryptedBody, secretKey);
      req.body = JSON.parse(decryptedBody);
    }
    next();
  } catch (error) {
    console.error('Error in decrypt middleware:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { decryptMiddleware };