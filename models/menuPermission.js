// user.js

import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const menuPermissionSchema = new mongoose.Schema({
 
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    menus:[
        {
           menuId :{type:mongoose.Types.ObjectId,ref:'menu'} 
        }
    ],
    isActive:{
        type:Boolean
    },
    isDeleted:{
        type:Boolean
    }
  
},{
    timestamps:true, versionKey:false
});

menuPermissionSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const MenuPermission = mongoose.model('menuPermission', menuPermissionSchema);

export default MenuPermission;
