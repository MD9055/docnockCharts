// user.js

const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const kinSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    kin_address_street1: {
        type: String,
    },
    kin_address_street2: {
        type: String,
    },
    city: {
        type: mongoose.Types.ObjectId,
        ref: "city"
    },
    state: {
        type: mongoose.Types.ObjectId,
        ref: "state"
    },
    country: {
        type: mongoose.Types.ObjectId,
        ref: "country"
    },
    zip_code: {
        type: String,
    },
    cell_String: {
        type: String
    },
    landline_String: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

kinSchema.plugin(aggregatePaginate);

const Kin = mongoose.model('kin', kinSchema);

module.exports = Kin;
