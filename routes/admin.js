var express = require('express');
var router = express.Router();
const {addUpdatePhyscians,listPhysicians,addAdminStaff, listAdminStaff} = require('../controllers/adminControllers')
const {authMiddleware} = require('../middleware/authUser')

/* GET home page. */
router.post('/addUpdatePhysician', authMiddleware,addUpdatePhyscians);
router.get('/listPhysicians', authMiddleware,listPhysicians);
router.post('/addUpdateStaff', authMiddleware,addAdminStaff);
router.get('/listAdminStaff', authMiddleware,listAdminStaff);





module.exports = router;
