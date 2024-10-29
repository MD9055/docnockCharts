const USER = require('../models/user');
const { sendEmail } = require('../utils/mailer');
const { generateJWTToken } = require('../utils/commonMethods');
process.env.NODE_ENV = process.env.NODE_ENV || "local"; // local
const config = require("../config.js").get(process.env.NODE_ENV);
const FunctoryFunctions = require('../middleware/factoryFunctions');

async function adminList(req, res) {
    const responseHandler = new FunctoryFunctions(res); // Instantiate FunctoryFunctions

    try {
        const currentUser = await req.user;
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        };
        const searchQuery = req.query.search ? req.query.search.trim() : '';
        const matchCondition = {
            role: 1,
            created_by: currentUser.userId,
            isDeleted: false,
        };

        if (searchQuery) {
            matchCondition.$or = [
                { firstName: { $regex: searchQuery, $options: 'i' } },
                { lastName: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        const myAggregate = USER.aggregate([
            { $match: matchCondition },
            { $sort: { createdAt: -1 } }
        ]);

        const results = await USER.aggregatePaginate(myAggregate, options);
        return responseHandler.responseSend(200, "Admin Fetched", results);
        
    } catch (err) {
        console.error('Error fetching admin list:', err);
        return responseHandler.responseSend(500, "Internal Server Error", null, err.message);
    }
}

async function addUpdateAdmin(req, res) {
    const responseHandler = new FunctoryFunctions(res); // Instantiate FunctoryFunctions

    const { id, firstName, lastName, email, mobile, dob, addressStreet1, addressStreet2, zipCode, country, state, city, companyName, companyAddressStreet1, companyAddressStreet2, companyZipCode, companyMobile, companyFax } = req.body;
   
    try {
        const userData = {
            firstName:firstName,
            lastName:lastName,
            email:email,
            phone: mobile,
            dob: new Date(dob),
            address_street1: addressStreet1,
            address_street2: addressStreet2,
            zip_code: zipCode,
            country:country,
            state:state,
            city:city,
            companyName:companyName,
            companyAddressStreet1:companyAddressStreet1,
            companyAddressStreet2:companyAddressStreet2,
            companyZipCode:companyZipCode,
            companyMobile:companyMobile,
            companyFax:companyFax,
            role: 1,
            created_by: req.user.userId
        };

        let response;
        if (id) {
            response = await USER.findByIdAndUpdate(id, userData, { new: true });
            if (!response) {
                return responseHandler.responseSend(404, "Admin not found.", []);
            }

            return responseHandler.responseSend(200, "Admin updated successfully.", response);
        } else {
            response = new USER(userData);
            await response.save();
            let payload = {
                _id: response._id,
                role: response.role
            };
            let generateToken = await generateJWTToken(payload, "2h");

            let setUpProfileLine = `${config.FRONTEND.HOST}:${config.FRONTEND.PORT}/setup-profile?token=${generateToken}`;

            const emailTemplate = `
            <p>Dear ${firstName},</p>
            <p>You have been added as an admin.</p>
            <p>Please click the button below to set up your profile:</p>
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

            await sendEmail(response.email, emailTemplate);
            return responseHandler.responseSend(res, 201, "Admin added successfully", []);
        }
    } catch (error) {
        console.error(error);
        return responseHandler.responseSend(500, 'An error occurred while processing your request.', null, error.message);
    }
}

module.exports = {
    adminList,
    addUpdateAdmin
};
