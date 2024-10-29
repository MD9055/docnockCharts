// user.js

import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const menuSchema = new mongoose.Schema({
 
    menuName:{
        type:String
    },
    menuURL:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
  
},{
    timestamps:true, versionKey:false
});

menuSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const Menu = mongoose.model('menu', menuSchema);

export default Menu;
