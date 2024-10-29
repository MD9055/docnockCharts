const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const citySchema = new mongoose.Schema({
    state_id: {
        type: mongoose.Types.ObjectId,
        ref: 'state'
    },
    name: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

citySchema.plugin(aggregatePaginate);

// Create a model using the schema  
const City = mongoose.model('city', citySchema);

module.exports = City;
