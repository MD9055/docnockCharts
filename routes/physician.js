var express = require('express');
var router = express.Router();
const {addUpdatePatients,listPatients,addPatients} = require('../controllers/physicianControllers')
const {authMiddleware} = require('../middleware/authUser')
const upload = require("../middleware/multerUpload");

/* GET home page. */
router.post('/addUpdatePatient', authMiddleware,addUpdatePatients);
router.post('/addPatient', authMiddleware,upload.single('omrsheet'),addPatients);

router.get('/listPatients', authMiddleware,listPatients);




module.exports = router;
