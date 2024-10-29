const USER = require('../models/user');
const { sendEmail } = require('../utils/mailer');
const { generateJWTToken } = require('../utils/commonMethods');
const Mongoose = require('mongoose');
process.env.NODE_ENV = process.env.NODE_ENV || "local"; // local
const config = require("../config.js").get(process.env.NODE_ENV);
const FunctoryFunctions = require('../middleware/factoryFunctions');


async function patientList(req, res) {
    const responseHandler = new FunctoryFunctions(res); 

    try {
        const currentUser = await req.user;
        let loggedInUser = await USER.findOne({_id:Mongoose.Types.ObjectId(currentUser.userId)})
        let matchCondition;
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        };
        const searchQuery = req.query.search ? req.query.search.trim() : '';
        if (req.user.role === 7) {
            matchCondition = {
                isDeleted: false,
                adminId: loggedInUser.adminId,
                role: 5
            };
        }
        if (searchQuery) {
            matchCondition.$or = [
                { firstName: { $regex: searchQuery, $options: 'i' } },
                { lastName: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
                { phone: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        const myAggregate = USER.aggregate([
            { $match: matchCondition },
            {
                $lookup: {
                    from: "countries",
                    localField: "country",
                    foreignField: "_id",
                    as: "country"
                }
            },
            {
                $unwind: {
                    path: "$country",
                    preserveNullAndEmptyArrays: true // Keep the original document if no match is found
                }
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state",
                    foreignField: "_id",
                    as: "state"
                }
            },
            {
                $unwind: {
                    path: "$state",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "city",
                    foreignField: "_id",
                    as: "city"
                }
            },
            {
                $unwind: {
                    path: "$city",
                    preserveNullAndEmptyArrays: true
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        const results = await USER.aggregatePaginate(myAggregate, options);
        return responseHandler.responseSend(200, "Physician Fetched", results);
        
    } catch (err) {
        console.error('Error fetching physician list:', err);
        return responseHandler.responseSend(500, "Internal Server Error", null, err.message);
    }
}




module.exports = {
    patientList
}