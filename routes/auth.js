var express = require('express');
var router = express.Router();
const {login, updateProfilePassword,forgetPassword, resetPassword} = require('../controllers/authControllers');
const {decryptMiddleware} = require('../middleware/encryption_decryption')


router.post('/login', login);
router.post('/updateProfile', updateProfilePassword)
router.post('/forgetPassword', forgetPassword)
router.post('/resetPassword', resetPassword)



module.exports = router;
