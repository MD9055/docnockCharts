var express = require('express');
var router = express.Router();
const {addUpdatePatients,listPatients,addPatients} = require('../controllers/physicianControllers')
const {authMiddleware} = require('../middleware/authUser')

/* GET home page. */
router.post('/addUpdatePatient', authMiddleware,addUpdatePatients);
router.post('/addPatient', authMiddleware,addPatients);

router.get('/listPatients', authMiddleware,listPatients);




module.exports = router;
