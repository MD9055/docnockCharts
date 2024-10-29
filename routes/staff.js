var express = require('express');
var router = express.Router();
const {patientList} = require('../controllers/staffControllers')
const {authMiddleware} = require('../middleware/authUser')

/* GET home page. */
router.get('/patientList', authMiddleware,patientList);






module.exports = router;
