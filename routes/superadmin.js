var express = require('express');
var router = express.Router();
const {adminList,addUpdateAdmin} = require('../controllers/superadminController')
const {authMiddleware} = require('../middleware/authUser')

/* GET home page. */
router.get('/alladmins', authMiddleware,adminList);
router.post('/admin', authMiddleware,addUpdateAdmin);



module.exports = router;
