const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const stateSchema = new mongoose.Schema({
    country_id: {
        type: mongoose.Types.ObjectId,
        ref: "country"
    },
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

stateSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const State = mongoose.model('state', stateSchema);

module.exports = State;
