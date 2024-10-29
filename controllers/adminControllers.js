const USER = require('../models/user');
const { sendEmail } = require('../utils/mailer');
const { generateJWTToken } = require('../utils/commonMethods');
const Mongoose = require('mongoose');
process.env.NODE_ENV = process.env.NODE_ENV || "local"; // local
const config = require("../config.js").get(process.env.NODE_ENV);
const FunctoryFunctions = require('../middleware/factoryFunctions');

async function addUpdatePhyscians(req, res) {
    const responseHandler = new FunctoryFunctions(res); // Instantiate FunctoryFunctions

    const {
        firstName,
        lastName,
        email,
        phone,
        dob,
        addressStreet1,
        addressStreet2,
        zipCode,
        country,
        state,
        city,
        medicalLicenceNumber,
        medicalLicenceDate,
        deaNumber,
        deaExpiryDate,
        cdsNumber,
        cdsExpiryDate,
        npiNumber,
        _id
    } = req.body;

    console.log(req.body);

    try {
        const physicianData = {
            firstName,
            lastName,
            email,
            phone,
            dob: new Date(dob),
            address_street1: addressStreet1,
            address_street2: addressStreet2,
            zip_code: zipCode,
            country,
            state,
            city,
            medical_licence_number: medicalLicenceNumber,
            medical_licence_date: medicalLicenceDate,
            dea_number: deaNumber,
            dea_expiry_date: deaExpiryDate,
            cds_number: cdsNumber,
            cds_expiry_date: cdsExpiryDate,
            npi_number: npiNumber,
            adminId: req.user.userId,
            role:2
        };

        let response;
        if (_id) {
            response = await USER.findByIdAndUpdate(_id, physicianData, { new: true });
            console.log(response);

            if (!response) {
                return responseHandler.responseSend(404, 'Physician not found.', null);
            }

            return responseHandler.responseSend(200, 'Physician updated successfully.', response);
        } else {
            response = new USER(physicianData);
            await response.save();

            let payload = {
                _id: response._id,
                role: response.role
            };

            let generateToken = await generateJWTToken(payload, "2h");
            let setUpProfileLine = `${config.FRONTEND.HOST}:${config.FRONTEND.PORT}/setup-profile?token=${generateToken}`;

            const emailTemplate = `
                <p>Dear ${firstName},</p>
                <p>You have been added as a physician.</p>
                <p>Please click the link below to set up your profile:</p>
                <a href="${setUpProfileLine}" style="display: inline-block; 
                   padding: 10px 20px; 
                   font-size: 16px; 
                   color: #ffffff; 
                   background-color: #007bff; 
                   text-decoration: none; 
                   border-radius: 5px;">Set Up Profile</a>
                <p>Best regards,</p>
                <p>Your Team</p>
            `;

            await sendEmail(response.email, emailTemplate); // Send email

            return responseHandler.responseSend(201, 'Physician added successfully.', response);
        }
    } catch (error) {
        console.error(error);
        return responseHandler.responseSend(500, 'An error occurred while processing your request.', null, error.message);
    }
}

async function listPhysicians(req, res) {
    const responseHandler = new FunctoryFunctions(res); 

    try {
        const currentUser = await req.user;
        let matchCondition
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        };
        const searchQuery = req.query.search ? req.query.search.trim() : '';
        if(req.user.role == 0){
            matchCondition = {
                isDeleted: false,
                role:2
            };
        }else{
            matchCondition = {
                isDeleted: false,
                adminId: currentUser.userId,
                role:2
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
                $lookup:{
                    from:"countries",
                    localField:"country",
                    foreignField:"_id",
                    as :"country"
                }
            },
            {
                $unwind:"$country"
            },
            {
                $lookup:{
                    from:"states",
                    localField:"state",
                    foreignField:"_id",
                    as :"state"
                }
            },
            {
                $unwind:"$state"
            },
            {
                $lookup:{
                    from:"cities",
                    localField:"city",
                    foreignField:"_id",
                    as :"city"
                }
            },
            {
                $unwind:"$city"
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


async function addAdminStaff(req, res) {
    const responseHandler = new FunctoryFunctions(res); // Instantiate FunctoryFunctions

    const {
        firstName,
        lastName,
        email,
        phone,
        dob,
        addressStreet1,
        addressStreet2,
        zipCode,
        country,
        state,
        city
    } = req.body;

    try {
        const staffData = {
            firstName,
            lastName,
            email,
            phone,
            dob: new Date(dob),
            address_street1: addressStreet1,
            address_street2: addressStreet2,
            zip_code: zipCode,
            country,
            state,
            city,
            adminId: req.user.userId,
            role: 7
        };

        // Create a new staff member
        const newStaff = new USER(staffData);
        await newStaff.save();

        let payload = {
            _id: newStaff._id,
            role: newStaff.role
        };

        let generateToken = await generateJWTToken(payload, "2h");
        let setUpProfileLine = `${config.FRONTEND.HOST}:${config.FRONTEND.PORT}/setup-profile?token=${generateToken}`;

        const emailTemplate = `
            <p>Dear ${firstName},</p>
            <p>You have been added as a Staff.</p>
            <p>Please click the link below to set up your profile:</p>
            <a href="${setUpProfileLine}" style="display: inline-block; 
               padding: 10px 20px; 
               font-size: 16px; 
               color: #ffffff; 
               background-color: #007bff; 
               text-decoration: none; 
               border-radius: 5px;">Set Up Profile</a>
            <p>Best regards,</p>
            <p>Your Team</p>
        `;

        await sendEmail(newStaff.email, emailTemplate); // Send email

        return responseHandler.responseSend(201, 'Staff added successfully.', newStaff);
    } catch (error) {
        console.error(error);
        return responseHandler.responseSend(500, 'An error occurred while processing your request.', null, error.message);
    }
}

async function listAdminStaff(req, res) {
    const responseHandler = new FunctoryFunctions(res); 

    try {
        const currentUser = await req.user;
        let matchCondition
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        };
        const searchQuery = req.query.search ? req.query.search.trim() : '';
        if(req.user.role == 0){
            matchCondition = {
                isDeleted: false,
                role:7
            };
        }else{
            matchCondition = {
                isDeleted: false,
                adminId: currentUser.userId,
                role:7
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
                $lookup:{
                    from:"countries",
                    localField:"country",
                    foreignField:"_id",
                    as :"country"
                }
            },
            {
                $unwind:"$country"
            },
            {
                $lookup:{
                    from:"states",
                    localField:"state",
                    foreignField:"_id",
                    as :"state"
                }
            },
            {
                $unwind:"$state"
            },
            {
                $lookup:{
                    from:"cities",
                    localField:"city",
                    foreignField:"_id",
                    as :"city"
                }
            },
            {
                $unwind:"$city"
            },

            { $sort: { createdAt: -1 } }
        ]);

        const results = await USER.aggregatePaginate(myAggregate, options);
        return responseHandler.responseSend(200, "Staff Fetched", results);
        
    } catch (err) {
        console.error('Error fetching staff list:', err);
        return responseHandler.responseSend(500, "Internal Server Error", null, err.message);
    }
}











module.exports = {
    addUpdatePhyscians,
    listPhysicians,
    addAdminStaff,
    listAdminStaff
    
};
