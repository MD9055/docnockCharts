// user.js

const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  companyName: {
    type: String
  },
  ein_no: {
    type: Number
  },
  npi_numner: {
    type: Number
  },
  company_address_street: {
    type: String
  },
  company_address_street2: {
    type: String
  },
  company_city: {
    type: mongoose.Types.ObjectId,
    ref: 'city'
  },
  company_country: {
    type: mongoose.Types.ObjectId,
    ref: 'country'
  },
  company_zip_code: {
    type: String
  },
  company_phone_number: {
    type: String
  },
  company_fax_number: {
    type: String
  },
  company_state: {
    type: mongoose.Types.ObjectId,
    ref: 'state'
  }
}, {
  timestamps: true,
  versionKey: false
});

companySchema.plugin(aggregatePaginate);

// Create a model using the schema  
const Company = mongoose.model('company', companySchema);

module.exports = Company;
