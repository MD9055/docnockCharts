// user.js

const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const countrySchema = new mongoose.Schema({
    name: {
        type: String
    },
    code: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

countrySchema.plugin(aggregatePaginate);

// Create a model using the schema  
const Country = mongoose.model('country', countrySchema);

module.exports = Country;
