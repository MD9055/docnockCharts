const COUNTRY = require('../models/country');
const STATE = require('../models/states');
const CITY = require('../models/city');
const USER = require('../models/user');
const mongoose = require('mongoose');
const FunctoryFunctions = require('../middleware/factoryFunctions');

async function getCountry(req, res) {
    const responseHandler = new FunctoryFunctions(res);
    
    try {
        let countryList = await COUNTRY.find({});
        console.log(countryList);
        return responseHandler.responseSend(200, "", countryList);
    } catch (err) {
        console.error(err);
        return responseHandler.responseSend(500, "An error occurred while retrieving the country list.", null, err.message);
    }
}

async function getState(req, res) {
    const responseHandler = new FunctoryFunctions(res);
    
    try {
        let stateList = await STATE.find({ country_id: req.query.country_id });
        console.log(stateList);
        return responseHandler.responseSend(200, "", stateList);
    } catch (err) {
        console.error(err);
        return responseHandler.responseSend(500, "An error occurred while retrieving the state list.", null, err.message);
    }
}

async function getCity(req, res) {
    const responseHandler = new FunctoryFunctions(res);
    
    try {
        let cityList = await CITY.find({ state_id: req.query.state_id });
        return responseHandler.responseSend(200, "", cityList);
    } catch (err) {
        console.error(err);
        return responseHandler.responseSend(500, "An error occurred while retrieving the city list.", null, err.message);
    }
}

async function getByID(req, res) {
    const responseHandler = new FunctoryFunctions(res);
    
    try {
        let _id = req.query._id;
        if (!_id) {
            return responseHandler.responseSend(400, 'User ID is required', null);
        }
        let user = await USER.findOne({ _id: mongoose.Types.ObjectId(_id) });
        if (!user) {
            return responseHandler.responseSend(404, 'User not found', null);
        }

        return responseHandler.responseSend(200, 'User retrieved successfully', user);
    } catch (err) {
        console.error(err);
        return responseHandler.responseSend(500, 'Internal server error', null, err.message);
    }
}


async function deleteByID(req, res) {
    const responseHandler = new FunctoryFunctions(res);

    try {
        const userId = req.body._id;

        if (!userId) {
            return responseHandler.responseSend(400, 'ID is required.', null);
        }

        const result = await USER.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true }
        );

        if (!result) {
            return responseHandler.responseSend(404, 'User not found.', null);
        }

        return responseHandler.responseSend(200, 'Deleted Successfully.', result);
    } catch (err) {
        console.error('Error during physician deletion:', err);
        return responseHandler.responseSend(500, 'Internal Server Error.', null, err.message);
    }
}


module.exports = {
    getCountry,
    getState,
    getCity,
    getByID,
    deleteByID
};
