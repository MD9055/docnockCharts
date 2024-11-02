var express = require('express');
var router = express.Router();
const {getCountry,getState,getCity,getByID, deleteByID,updateByID} = require('../controllers/commonControllers')

/* GET home page. */
router.get('/country',getCountry);
router.get('/state',getState);
router.get('/city',getCity);
router.get('/getById', getByID)
router.put('/deleteByID', deleteByID)
router.put('/updateByID', updateByID)







module.exports = router;
