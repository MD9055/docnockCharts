const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const insuranceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    medicare: {
        type: String,
        default: null
    },
    medicaid_number: {
        type: String,
        default: null
    },
    insurance_number: {
        type: String,
        default: null
    },
    insurance_policy_number: {
        type: String,
        default: null
    },
    insurance_authorization_number: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

insuranceSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const Insurance = mongoose.model('insuranced', insuranceSchema,'insuranced');

module.exports = Insurance;
