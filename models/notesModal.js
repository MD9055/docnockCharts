// user.js

import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const notesModalSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true
    },
    data_id:{
        type: String,
        enum: ["history","ros","social_history","allergies","physical","plan"],
        required:true
    },
    name:{
        type: String,
        required:true
    },
    description:{
        type:String,
        requird:true
    }
  
},{
    timestamps:true, versionKey:false
});

notesModalSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const Company = mongoose.model('notemodal', notesModalSchema);

export default Company;
