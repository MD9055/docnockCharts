// user.js

const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const insuranceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    insurance_name: {
        type: String
    },
    insurance_number: {
        type: String
    },
    medicare_number: {
        type: String
    },
    medicaid_number: {
        type: String
    },
    insurance_policy_number: {
        type: String
    },
    social_security_number: {
        type: String
    },
    private_insurance: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

insuranceSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const Insurance = mongoose.model('insurance', insuranceSchema, 'insurance');

module.exports = Insurance;
