const USER = require('../models/user');
const { sendEmail } = require('../utils/mailer');
const { generateJWTToken } = require('../utils/commonMethods');
const Mongoose = require('mongoose');
process.env.NODE_ENV = process.env.NODE_ENV || "local"; // local
const config = require("../config.js").get(process.env.NODE_ENV);
const FunctoryFunctions = require('../middleware/factoryFunctions');
const KinSchema = require('../models/kinInfo.js')
const EncryptionService = require('../middleware/EncryptionService.js'); 
const InsuranceSchema = require('../models/insurance.js')


// async function addUpdatePatients(req, res) {
//     const responseHandler = new FunctoryFunctions(res); // Instantiate FunctoryFunctions
//     let physicianId = await req.user.userId
//     let getAdminId = await USER.findOne({_id:physicianId})
//     const {
//         firstName,
//         lastName,
//         phone,
//         email,
//         dob,
//         address_street1,
//         address_street2,
//         zip_code,
//         medicare_number,
//         medicaid_number,
//         insurance_policy_number,
//         admission_location,
//         insurance_name,
//         ssn,
//         department,
//         address,
//         country,
//         state,
//         city,
//         kin_first_name,
//         kin_last_name,
//         kin_address_street1,
//         kin_address_street2,
//         kin_zip_code,
//         kin_cell_number,
//         kin_landline_number,
//         kin_country,
//         kin_state,
//         kin_city,
//         _id,
        
//     } = req.body;

    

//     try {
//         const patientData = {
//             firstName,
//             lastName,
//             phone,
//             email,
//             dob: new Date(dob),
//             address_street1,
//             address_street2,
//             zip_code,
//             medicare_number,
//             medicaid_number,
//             insurance_policy_number,
//             admission_location,
//             insurance_name,
//             ssn,
//             department,
//             address,
//             country,
//             state,
//             city,
//             kin_first_name,
//             kin_last_name,
//             kin_address_street1,
//             kin_address_street2,
//             kin_zip_code,
//             kin_cell_number,
//             kin_landline_number,
//             kin_country,
//             kin_state,
//             kin_city,
//             adminId: req.user.userId,
//             role: 5,
//             physicianId:physicianId,
//             adminId:getAdminId._id,
//             created_by:getAdminId.created_by
//         };

//         let response;
//         if (_id) {
//             response = await USER.findByIdAndUpdate(_id, patientData, { new: true });
//             console.log(response);

//             if (!response) {
//                 return responseHandler.responseSend(404, 'Patient not found.', null);
//             }

//             return responseHandler.responseSend(200, 'Patient updated successfully.', response);
//         } else {
//             response = new USER(patientData);
//             await response.save();
//             return responseHandler.responseSend(201, 'Patient added successfully.', response);
//         }
//     } catch (error) {
//         console.error(error);
//         return responseHandler.responseSend(500, 'An error occurred while processing your request.', null, error.message);
//     }
// }

// async function addUpdatePatients(req, res) {

//     console.log(req.body)
//     const responseHandler = new FunctoryFunctions(res);

//     if (!req.user || !req.user.userId) {
//         return responseHandler.responseSend(401, 'Unauthorized: User ID not found.', null);
//     }

//     const physicianId = req.user.userId;

//     let getAdminId;
//     try {
//         getAdminId = await USER.findOne({ _id: Mongoose.Types.ObjectId(physicianId) });
//         if (!getAdminId) {
//             return responseHandler.responseSend(404, 'Admin not found.', null);
//         }
//     } catch (error) {
//         console.error('Error fetching admin ID:', error);
//         return responseHandler.responseSend(500, 'Internal Server Error: Unable to fetch admin ID.', null);
//     }

//     const {
//         firstName,
//         lastName,
//         phone,
//         email,
//         dob,
//         address_street1,
//         address_street2,
//         zip_code,
//         medicare_number,
//         medicaid_number,
//         insurance_policy_number,
//         admission_location,
//         insurance_name,
//         ssn,
//         department,
//         address,
//         country,
//         state,
//         city,
//         kin_first_name,
//         kin_last_name,
//         kin_address_street1,
//         kin_address_street2,
//         kin_zip_code,
//         kin_cell_number,
//         kin_landline_number,
//         kin_country,
//         kin_state,
//         kin_city,
//         _id,
//     } = req.body;

//     const requiredFields = [firstName, lastName, phone, email, dob, address_street1];
//     if (requiredFields.some(field => !field)) {
//         return responseHandler.responseSend(400, 'Bad Request: Missing required fields.', null);
//     }

//     const parsedDob = new Date(dob);
//     if (isNaN(parsedDob)) {
//         return responseHandler.responseSend(400, 'Bad Request: Invalid date format.', null);
//     }

//     const patientData = {
//         firstName,
//         lastName,
//         phone,
//         email,
//         dob: parsedDob,
//         address_street1,
//         address_street2,
//         zip_code,
//         medicare_number,
//         medicaid_number,
//         insurance_policy_number,
//         admission_location,
//         insurance_name,
//         socian_security_number:ssn,
//         department,
//         address,
//         country,
//         state,
//         city,
//         adminId: req.user.userId,
//         role: 5,
//         physicianId: physicianId,
//         adminId: getAdminId._id,
//         created_by: getAdminId.created_by
//     };

//     try {
//         let response;
//         if (_id) {
//             response = await USER.findByIdAndUpdate(_id, patientData, { new: true });
//             if (!response) {
//                 return responseHandler.responseSend(404, 'Patient not found.', null);
//             }
//             return responseHandler.responseSend(200, 'Patient updated successfully.', response);
//         } else {
//             let savedKinData
//             response = new USER(patientData);
//             let savedPatientInfo = await response.save();
//             if(savedPatientInfo){
//                 let kinPayload = {
//                     userId: savedPatientInfo._id,
//                     kin_first_name,
//                     kin_last_name,
//                     kin_address_street1,
//                     kin_address_street2,
//                     kin_zip_code,
//                     kin_cell_number,
//                     kin_landline_number,
//                     kin_country,
//                     kin_state,
//                     kin_city,
//                 }
//                 let  kinInfo = await new KinSchema(kinPayload)

//                  savedKinData = await kinInfo.save()
//                 if(savedKinData){
//                     await USER.findOneAndUpdate({_id:Mongoose.Types.ObjectId(savedPatientInfo._id)}, {$set:{kin_information:savedKinData._id}}, {new:true})
//                 }
//             }
//             if(savedKinData){
//                 return responseHandler.responseSend(200, 'Patient added successfully.', kinInfo);

//             }else{
//                 return responseHandler.responseSend(500, 'Patient Failed to add.', response);

//             }
//         }
//     } catch (error) {
//         console.error('Error during save/update:', error);
//         return responseHandler.responseSend(500, 'Internal Server Error: An error occurred while processing your request.', null);
//     }
// }

async function addUpdatePatients_withoutEncrypt(req, res) {
    const responseHandler = new FunctoryFunctions(res);

    if (!req.user || !req.user.userId) {
        return responseHandler.responseSend(401, 'Unauthorized: User ID not found.', null);
    }

    const physicianId = req.user.userId;
    let getAdminId;

    try {
        getAdminId = await USER.findById(Mongoose.Types.ObjectId(physicianId));
        if (!getAdminId) {
            return responseHandler.responseSend(404, 'Admin not found.', null);
        }
    } catch (error) {
        console.error('Error fetching admin ID:', error);
        return responseHandler.responseSend(500, 'Internal Server Error: Unable to fetch admin ID.', null);
    }

    const {
        firstName,
        lastName,
        phone,
        email,
        dob,
        address_street1,
        address_street2,
        zip_code,
        medicare_number,
        medicaid_number,
        insurance_policy_number,
        admission_location,
        insurance_name,
        ssn,
        department,
        address,
        country,
        state,
        city,
        kin_first_name,
        kin_last_name,
        kin_address_street1,
        kin_address_street2,
        kin_zip_code,
        kin_cell_number,
        kin_landline_number,
        kin_country,
        kin_state,
        kin_city,
        _id,
    } = req.body;

    const requiredFields = [firstName, lastName, phone, email, dob, address_street1];
    if (requiredFields.some(field => !field)) {
        return responseHandler.responseSend(400, 'Bad Request: Missing required fields.', null);
    }

    const parsedDob = new Date(dob);
    if (isNaN(parsedDob)) {
        return responseHandler.responseSend(400, 'Bad Request: Invalid date format.', null);
    }
    const patientData = {
        firstName,
        lastName,
        phone,
        email,
        dob: parsedDob,
        address_street1,
        address_street2,
        zip_code,
        medicare_number,
        medicaid_number,
        insurance_policy_number,
        admission_location,
        insurance_name,
        socian_security_number: ssn,
        department,
        address,
        country,
        state,
        city,
        adminId: getAdminId._id,
        role: 5,
        physicianId,
        created_by: getAdminId.created_by
    };

    try {
        let response;
        if (_id) {
            response = await USER.findByIdAndUpdate(_id, patientData, {
                new: true
            });
            if (!response) {
                return responseHandler.responseSend(404, 'Patient not found.', null);
            }
            return responseHandler.responseSend(200, 'Patient updated successfully.', response);
        } else {
            const savedPatientInfo = await new USER(patientData).save();
            if (!savedPatientInfo) {
                return responseHandler.responseSend(500, 'Patient failed to add.', null);
            }

            const kinPayload = {
                userId: savedPatientInfo._id,
                firstName:kin_first_name,
                lastName:kin_last_name,
                kin_address_street1:kin_address_street1,
                kin_address_street2:kin_address_street2,
                zip_code:kin_zip_code,
                cell_number:kin_cell_number,
                landline_number:kin_landline_number,
                country:kin_country,
                state:kin_state,
                city:kin_city,
            };
            try {
                const kinInfo = await new KinSchema(kinPayload).save();
                if (kinInfo) {
                    await USER.findByIdAndUpdate(
                        savedPatientInfo._id, {
                            $set: {
                                kin_information: kinInfo._id
                            }
                        }, {
                            new: true
                        }
                    );
                    return responseHandler.responseSend(200, 'Patient added successfully.', kinInfo);
                } else {
                    throw new Error('Failed to save kin information.');
                }
            } catch (kinError) {
                await USER.findByIdAndDelete(savedPatientInfo._id);
                console.error('Kin information error:', kinError);
                return responseHandler.responseSend(500, 'Failed to save kin information, patient data rolled back.', null);
            }
        }
    } catch (error) {
        console.error('Error during save/update:', error);
        return responseHandler.responseSend(500, 'Internal Server Error: An error occurred while processing your request.', null);
    }
}



async function addUpdatePatients(req, res) {
    const responseHandler = new FunctoryFunctions(res);
    const encryptionService = new EncryptionService();

    if (!req.user || !req.user.userId) {
        return responseHandler.responseSend(401, 'Unauthorized: User ID not found.', null);
    }

    let checkUserExist = await USER.findOne({email:email.toLowerCase()});
    if(checkUserExist){
    return responseHandler.responseSend(200, 'User already Exist with this email', null, []);

    }

    const physicianId = req.user.userId;
    let getAdminId;

    try {
        getAdminId = await USER.findById(Mongoose.Types.ObjectId(physicianId));
        if (!getAdminId) {
            return responseHandler.responseSend(404, 'Admin not found.', null);
        }
    } catch (error) {
        console.error('Error fetching admin ID:', error);
        return responseHandler.responseSend(500, 'Internal Server Error: Unable to fetch admin ID.', null);
    }

    const {
        firstName,
        lastName,
        phone,
        email,
        dob,
        address_street1,
        address_street2,
        zip_code,
        medicare_number,
        medicaid_number,
        insurance_policy_number,
        admission_location,
        insurance_name,
        ssn,
        department,
        address,
        country,
        state,
        city,
        kin_first_name,
        kin_last_name,
        kin_address_street1,
        kin_address_street2,
        kin_zip_code,
        kin_cell_number,
        kin_landline_number,
        kin_country,
        kin_state,
        kin_city,
        _id,
    } = req.body;


    const requiredFields = [firstName, lastName,  dob];
    if (requiredFields.some(field => !field)) {
        return responseHandler.responseSend(400, 'Bad Request: Missing required fields.', null);
    }
    const parsedDob = new Date(dob);
    if (isNaN(parsedDob)) {
        return responseHandler.responseSend(400, 'Bad Request: Invalid date format.', null);
    }
    const patientData = {
        firstName: encryptionService.encrypt(firstName),
        lastName: encryptionService.encrypt(lastName),
        phone: encryptionService.encrypt(phone.toString()),
        email: encryptionService.encrypt(email),
        dob: parsedDob,
        address_street1: encryptionService.encrypt(address_street1),
        address_street2: encryptionService.encrypt(address_street2),
        zip_code: zip_code,
        admission_location: admission_location,
        department: encryptionService.encrypt(department.toString()),
        address: encryptionService.encrypt(address),
        country: country,
        state: state,
        city: city,
        adminId: getAdminId.adminId,
        role: 5,
        physicianId:req.user.userId,
        created_by: getAdminId.created_by
    };
    try {
        let response;
        if (_id) {
            response = await USER.findByIdAndUpdate(_id, patientData, {
                new: true
            });
            if (!response) {
                return responseHandler.responseSend(404, 'Patient not found.', null);
            }else{

                let insurancePayload = {
                    userId: savedPatientInfo._id,
                    insurance_number: encryptionService.encrypt(insurance_policy_number.toString()),
                    insurance_name: encryptionService.encrypt(insurance_name),
                    medicare_number: encryptionService.encrypt(medicare_number.toString()),
                    medicaid_number: encryptionService.encrypt(medicaid_number.toString()),
                    insurance_policy_number: encryptionService.encrypt(insurance_policy_number.toString()),
                    socian_security_number: encryptionService.encrypt(ssn.toString()),
    
                }
    
                const kinPayload = {
                    userId: savedPatientInfo._id,
                    firstName: encryptionService.encrypt(kin_first_name),
                    lastName: encryptionService.encrypt(kin_last_name),
                    kin_address_street1: encryptionService.encrypt(kin_address_street1),
                    kin_address_street2: encryptionService.encrypt(kin_address_street2),
                    zip_code: encryptionService.encrypt(kin_zip_code),
                    cell_number: encryptionService.encrypt(kin_cell_number.toString()),
                    landline_number: encryptionService.encrypt(kin_landline_number.toString()),
                    country: kin_country,
                    state: kin_state,
                    city: kin_city,
                };

                const kinInfo = await new KinSchema(kinPayload).save();
                const saveInsurance = await new InsuranceSchema(insurancePayload).save()

                if (kinInfo) {
                    await USER.findByIdAndUpdate(
                        savedPatientInfo._id, {
                            $set: {
                                kin_information: kinInfo._id,
                                insurance_details:saveInsurance._id
                            }
                        }, {
                            new: true
                        }
                    );
                    return responseHandler.responseSend(200, 'Patient added successfully.', kinInfo);
                } else {
                    throw new Error('Failed to save kin information.');
                }


            }

            return responseHandler.responseSend(200, 'Patient updated successfully.', response);
        } 
        
        
    } catch (error) {
        console.log('Error during save/update:', error);
        return responseHandler.responseSend(500, 'Internal Server Error: An error occurred while processing your request.', null);
    }
}




async function listPatients(req, res) {
    const responseHandler = new FunctoryFunctions(res);

    try {
        const currentUser = await req.user;
        let matchCondition;
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        };
        const searchQuery = req.query.search ? req.query.search.trim() : '';

        if (currentUser.role === 0) {
            matchCondition = {
                isDeleted: false,
                role: 5 
            };
        } else {
            matchCondition = {
                isDeleted: false,
                physicianId: currentUser.userId,
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
                    preserveNullAndEmptyArrays: true // Preserve original document if no match found
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
                    preserveNullAndEmptyArrays: true // Preserve original document if no match found
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
                    preserveNullAndEmptyArrays: true // Preserve original document if no match found
                }
            },
            {
                $lookup: {
                    from: "kins",
                    localField: "kin_information",
                    foreignField: "_id",
                    as: "kin_information"
                }
            },
            {
                $unwind: {
                    path: "$kin_information",
                    preserveNullAndEmptyArrays: true // Preserve original document if no match found
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        

        const results = await USER.aggregatePaginate(myAggregate, options);
        return responseHandler.responseSend(200, "Patients fetched successfully", results);
        
    } catch (err) {
        console.error('Error fetching patient list:', err);
        return responseHandler.responseSend(500, "Internal Server Error", null, err.message);
    }
}


async function addPatients(req, res) {
    
    const responseHandler = new FunctoryFunctions(res);
    const encryptionService = new EncryptionService();
    let imageData;


    if (req.file !== undefined) {
        imageData = req.file.path;
      } else {
        imageData = req.body.image;
      }

    if (!req.user || !req.user.userId) {
        return responseHandler.responseSend(401, 'Unauthorized: User ID not found.', null);
    }

    const physicianId = req.user.userId;

    let getAdminId;

    try {

        let checkUserExist = await USER.findOne({email:email.toLowerCase()});
        if(checkUserExist){
        return responseHandler.responseSend(200, 'User already Exist with this email', null, []);

        }
        getAdminId = await USER.findById(Mongoose.Types.ObjectId(physicianId));

        console.log(getAdminId)
        if (!getAdminId) {
            return responseHandler.responseSend(404, 'Admin not found.', null);
        }
    } catch (error) {
        console.error('Error fetching admin ID:', error);
        return responseHandler.responseSend(500, 'Internal Server Error: Unable to fetch admin ID.', null);
    }

    const {
        firstName,
        lastName,
        phone,
        email,
        dob,
        address_street1,
        address_street2,
        zip_code,
        medicare_number,
        medicaid_number,
        insurance_policy_number,
        admission_location,
        insurance_name,
        ssn,
        department,
        address,
        country,
        state,
        city,
        kin_first_name,
        kin_last_name,
        kin_address_street1,
        kin_address_street2,
        kin_zip_code,
        kin_cell_number,
        kin_landline_number,
        kin_country,
        kin_state,
        kin_city,
    } = req.body;

    const requiredFields = [firstName, lastName, dob];
    if (requiredFields.some(field => !field)) {
        return responseHandler.responseSend(400, 'Bad Request: Missing required fields.', null);
    }

    const parsedDob = new Date(dob);
    if (isNaN(parsedDob)) {
        return responseHandler.responseSend(400, 'Bad Request: Invalid date format.', null);
    }

    const patientData = {
        firstName: encryptionService.encrypt(firstName),
        lastName: encryptionService.encrypt(lastName),
        dob: parsedDob,
        adminId: getAdminId.adminId,
        role: 5,
        physicianId: req.user.userId,
        created_by: getAdminId.created_by,
        // Only encrypt and add fields if they exist
        phone: phone ? encryptionService.encrypt(phone.toString()) : undefined,
        email: email ? encryptionService.encrypt(email) : undefined,
        address_street1: address_street1 ? encryptionService.encrypt(address_street1) : undefined,
        address_street2: address_street2 ? encryptionService.encrypt(address_street2) : undefined,
        zip_code: zip_code || undefined,
        admission_location: admission_location || undefined,
        department: department ? encryptionService.encrypt(department.toString()) : undefined,
        address: address ? encryptionService.encrypt(address) : undefined,
        country: country || undefined,
        state: state || undefined,
        city: city || undefined,
        omrSheet: imageData
    };

    try {
        // await newUser.save();
        const newUser = await new USER(patientData);
        const savedPatientInfo = await newUser.save();
        if (!savedPatientInfo) {
            return responseHandler.responseSend(500, 'Patient failed to add.', null);
        }

        let insurancePayload = {
            userId: savedPatientInfo._id,
            insurance_number: insurance_policy_number ? encryptionService.encrypt(insurance_policy_number.toString()) : undefined,
            insurance_name: insurance_name ? encryptionService.encrypt(insurance_name) : undefined,
            medicare_number: medicare_number ? encryptionService.encrypt(medicare_number.toString()) : undefined,
            medicaid_number: medicaid_number ? encryptionService.encrypt(medicaid_number.toString()) : undefined,
            insurance_policy_number: insurance_policy_number ? encryptionService.encrypt(insurance_policy_number.toString()) : undefined,
            socian_security_number: ssn ? encryptionService.encrypt(ssn.toString()) : undefined,
        };

        const kinPayload = {
            userId: savedPatientInfo._id,
            firstName: kin_first_name ? encryptionService.encrypt(kin_first_name) : undefined,
            lastName: kin_last_name ? encryptionService.encrypt(kin_last_name) : undefined,
            kin_address_street1: kin_address_street1 ? encryptionService.encrypt(kin_address_street1) : undefined,
            kin_address_street2: kin_address_street2 ? encryptionService.encrypt(kin_address_street2) : undefined,
            zip_code: kin_zip_code ? encryptionService.encrypt(kin_zip_code) : undefined,
            cell_number: kin_cell_number ? encryptionService.encrypt(kin_cell_number.toString()) : undefined,
            landline_number: kin_landline_number ? encryptionService.encrypt(kin_landline_number.toString()) : undefined,
            country: kin_country || undefined,
            state: kin_state || undefined,
            city: kin_city || undefined,
        };

        try {
            const kinInfo = await new KinSchema(kinPayload).save();
            const saveInsurance = await new InsuranceSchema(insurancePayload).save();
            if (kinInfo) {
                await USER.findByIdAndUpdate(
                    savedPatientInfo._id, {
                        $set: {
                            kin_information: kinInfo._id,
                            insurance_details: saveInsurance._id
                        }
                    }, {
                        new: true
                    }
                );
                return responseHandler.responseSend(200, 'Patient added successfully.', []);
            } else {
                throw new Error('Failed to save kin information.');
            }
        } catch (kinError) {
            await USER.findByIdAndDelete(savedPatientInfo._id);
            console.error('Kin information error:', kinError);
            return responseHandler.responseSend(500, 'Failed to save kin information, patient data rolled back.', null);
        }
    } catch (error) {
        console.log('Error during save/update:', error);
        return responseHandler.responseSend(500, 'Internal Server Error: An error occurred while processing your request.', null);
    }
}







module.exports = {
    addUpdatePatients,
    listPatients,
    addPatients
  
    
};
