// user.js

import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const medicationSchema = new mongoose.Schema({
WenoDrugIdv:{
    type:String
 },
BrandName:{
    type:String
 },
CodeListQualifier:{
    type:String
 },
CreatedDate:{
    type:String
 },
DEASchedule:{
    type:String
 },
DEAScheduleStatus:{
    type:String
 },
DeletedDate:{
    type:String
 },
DisplayNameSynonym:{
    type:String
 },
Display_Name:{
    type:String
 },
DrugInteraction:{
    type:String
 },
FullGenericName:{
    type:String
 },
FullName:{
    type:String
 },
GenericRXCUI:{
    type:String
 },
Ingredients:{
    type:String
 },
IsActive:{
    type:String
 },
IsDeleted:{
    type:String
 },
IsRetired:{
    type:String
 },
NCPDPQuantitiyTerm:{
    type:String
 },
NewDoseForm:{
    type:String
 },
PotencyUnitCode:{
    type:String
 },
PsnDrugDescription:{
    type:String
 },
RXCUI:{
    type:String
 },
Route:{
    type:String
 },
RxnDoseForm:{
    type:String
 },
SXDG_Name:{
    type:String
 },
SXDG_RXCUI:{
    type:String
 },
SXDG_TTY:{
    type:String
 },
Strengthv:{
    type:String
 },
SuppressFor:{
    type:String
 },
TTY:{
    type:String
 },
UnitSourceCode:{
    type:String
 },

},{
    timestamps:true, versionKey:false
});

medicationSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const Medication = mongoose.model('medication', medicationSchema);

export default Medication;
