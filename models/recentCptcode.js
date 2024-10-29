// user.js

import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const recentcptcodeSchema = new mongoose.Schema({
    doctor_id:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    code_id:{
        type:mongoose.Types.ObjectId,
        ref:'cptCode'
    }
},{
    timestamps:true, versionKey:false
});

recentcptcodeSchema.index({ desc: 'text' });
recentcptcodeSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const recentcptCode = mongoose.model('recentcptCode', recentcptcodeSchema);

export default recentcptCode;
