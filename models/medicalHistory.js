    // user.js

import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const medicalHistory = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    illnesses:[
        {
            name: {
              type: String,
            },
            date: {
              type: Date,
              default: Date.now,             
            },
            status: {
                type: Boolean,
                default:true
          
            },
          },
    ],
    surgeries:[
        {
            name: {
              type: String,
            },
            date: {
              type: Date,
              default: Date.now,
            },
            status: {
              type: Boolean,
              default:true
              
            },
          },
    ],
    allergies:[
        {
            name: {
              type: String,
            },
            date: {
              type: Date,
              default: Date.now, 
            },
            status: {
                type: Boolean,
                default:true
            },
          },
    ],
    medications: [
        {
            name: {
              type: String,
            },
            date: {
              type: Date,
              default: Date.now, 
            },
            status: {
                type: Boolean,
                default:true
            },
          },
      ],

  
},{
    timestamps:true, versionKey:false
});

medicalHistory.plugin(aggregatePaginate);

// Create a model using the schema  
const MedicalHistory = mongoose.model('medicalhistory', medicalHistory);

export default MedicalHistory;
