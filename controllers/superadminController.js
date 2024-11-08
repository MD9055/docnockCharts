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

// async function addUpdateAdmin(req, res) {
//     const responseHandler = new FunctoryFunctions(res); // Instantiate FunctoryFunctions

//     const { id, firstName, lastName, email, mobile, dob, addressStreet1, addressStreet2, zipCode, country, state, city, companyName, companyAddressStreet1, companyAddressStreet2, companyZipCode, companyMobile, companyFax } = req.body;
   
//     try {
//         let attempCounter = 0;
//         let checkUserExist = await USER.findOne({email:email.toLowerCase()});
//         if(checkUserExist.emailChangeAttempt > 3){
//             return responseHandler.responseSend(201, 'You have exceeded the limit of changing email.. Try after 6 hours', null, []);
//         }
//         if(checkUserExist){
//            await USER.findOneAndUpdate({_id:checkUserExist._id}, {$set:{emailChangeAttempt:attempCounter}})
//         return responseHandler.responseSend(201, 'User already Exist with this email', null, []);
//         }
//         const userData = {
//             firstName:firstName,
//             lastName:lastName,
//             email:email,
//             phone: mobile,
//             dob: new Date(dob),
//             address_street1: addressStreet1,
//             address_street2: addressStreet2,
//             zip_code: zipCode,
//             country:country,
//             state:state,
//             city:city,
//             companyName:companyName,
//             companyAddressStreet1:companyAddressStreet1,
//             companyAddressStreet2:companyAddressStreet2,
//             companyZipCode:companyZipCode,
//             companyMobile:companyMobile,
//             companyFax:companyFax,
//             role: 1,
//             created_by: req.user.userId
//         };

//         let response;
//         if (id) {
//             response = await USER.findByIdAndUpdate(id, userData, { new: true });
//             if (!response) {
//                 return responseHandler.responseSend(404, "Admin not found.", []);
//             }
//             return responseHandler.responseSend(200, "Admin updated successfully.", response);
//         } else {
//             response = new USER(userData);
//             await response.save();
//             let payload = {
//                 _id: response._id,
//                 role: response.role
//             };
//             let generateToken = await generateJWTToken(payload, "2h");
// let newHost = 'http://159.203.100.155'
//             let setUpProfileLine = `${newHost}/setup-profile?token=${generateToken}`;

//             const emailTemplate = `
//             <p>Dear ${firstName},</p>
//             <p>You have been added as an admin.</p>
//             <p>Please click the button below to set up your profile:</p>
//             <a href="${setUpProfileLine}" style="display: inline-block; 
//                padding: 10px 20px; 
//                font-size: 16px; 
//                color: #ffffff; 
//                background-color: #007bff; 
//                text-decoration: none; 
//                border-radius: 5px;">Set Up Profile</a>
//             <p>Best regards,</p>
//             <p>Your Team</p>
//             `;

//             await sendEmail(response.email, emailTemplate);
//             return responseHandler.responseSend(res, 201, "Admin added successfully", []);
//         }
//     } catch (error) {
//         console.error(error);
//         return responseHandler.responseSend(500, 'An error occurred while processing your request.', null, error.message);
//     }
// }

async function addUpdateAdmin(req, res) {
    const responseHandler = new FunctoryFunctions(res);
    const { id, firstName, lastName, email, mobile, dob, addressStreet1, addressStreet2, zipCode, country, state, city, companyName, companyAddressStreet1, companyAddressStreet2, companyZipCode, companyMobile, companyFax } = req.body;

    try {
        let checkUserExist = await USER.findOne({ email: email.toLowerCase() });
        let currentUser = null;
        if (id) {
            currentUser = await USER.findById(id);
        }
        if (checkUserExist && currentUser && checkUserExist._id.toString() !== currentUser._id.toString()) {
            if (currentUser.emailChangeAttempt >= 3) {
                return responseHandler.responseSend(201, 'You have exceeded the limit of changing email. Try after 6 hours.', null, []);
            }
            await USER.findOneAndUpdate(
                { _id: currentUser._id },
                { 
                    $inc: { emailChangeAttempt: 1 },
                    emailChangeAttemptTimeStamp: new Date()
                }
            );
            return responseHandler.responseSend(201, 'User already exists with this email.', null, []);
        }
        const userData = {
            firstName,
            lastName,
            email,
            phone: mobile,
            dob: new Date(dob),
            address_street1: addressStreet1,
            address_street2: addressStreet2,
            zip_code: zipCode,
            country,
            state,
            city,
            companyName,
            companyAddressStreet1,
            companyAddressStreet2,
            companyZipCode,
            companyMobile,
            companyFax,
            role: 1,
            created_by: req.user.userId
        };
        let response;
        if (id) {
            response = await USER.findByIdAndUpdate(id, userData, { new: true });
            if (!response) {
                return responseHandler.responseSend(404, "Admin not found.", []);
            }
            if (currentUser.email !== email.toLowerCase()) {
                await USER.findOneAndUpdate({ _id: currentUser._id }, { $set: { emailChangeAttempt: 0 } });
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
            let newHost = 'http://159.203.100.155';
            let setUpProfileLine = `${newHost}/setup-profile?token=${generateToken}`;

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



async function totalPatientsAndNewPatients(req, res) {
    const responseHandler = new FunctoryFunctions(res);
    try {
        const today = new Date();
        const fifteenDaysAgo = new Date(today);
        fifteenDaysAgo.setDate(today.getDate() - 15);

        const results = await USER.aggregate([
            {
                $facet: {
                    totalPatients: [
                        {
                            $match: {
                                role: 5,
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    newPatients: [
                        {
                            $match: {
                                role: 5,
                                createdAt: { $gte: fifteenDaysAgo }
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    totalAdmins: [
                        {
                            $match: {
                                role: 1,
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    totalPhysicians: [
                        {
                            $match: {
                                role: 2,
                            }
                        },
                        {
                            $count: "count"
                        }
                    ]
                    
                }
            }
        ]);

        const totalPatientsCount = results[0].totalPatients[0]?.count || 0;
        const newPatientsCount = results[0].newPatients[0]?.count || 0;
        const totalAdminsCount = results[0].totalAdmins[0]?.count || 0;
        const totalPhysicianCount = results[0].totalPhysicians[0]?.count || 0;


        const responseData = {
            totalPatients: totalPatientsCount,
            newPatients: newPatientsCount,
            totalAdmins: totalAdminsCount,
            totalPhysician:totalPhysicianCount
        };

        console.log('Response Data:', responseData);

        return responseHandler.responseSend(200, "Patient counts retrieved successfully", responseData);

    } catch (error) {
        console.error('Error:', error);
        return responseHandler.responseSend(500, 'An error occurred while processing your request.', null, error.message);
    }
}






module.exports = {
    adminList,
    addUpdateAdmin,
    totalPatientsAndNewPatients
};
