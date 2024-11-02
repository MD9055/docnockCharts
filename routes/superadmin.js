var express = require('express');
var router = express.Router();
const {adminList,addUpdateAdmin,totalPatientsAndNewPatients} = require('../controllers/superadminController')
const {authMiddleware} = require('../middleware/authUser')

/* GET home page. */
router.get('/alladmins', authMiddleware,adminList);
router.post('/admin', authMiddleware,addUpdateAdmin);
router.post('/newAndTotalPatients', authMiddleware,totalPatientsAndNewPatients);




module.exports = router;
