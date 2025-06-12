import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for Snippet Document
export interface ISnippet extends Document {
  user:mongoose.Types.ObjectId,
  title:string,
  language:string,
  code:string,
    starredBy?: mongoose.Types.ObjectId[];

}

const snippetSchema: Schema<ISnippet> = new Schema({
 user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
 },
 title:{
    type:String,
    required:[true,"A snippet must have a title"],
 },
 language:{
    type:String,
    required:[true,"Must select a language"],

 },
 code:{
    type:String,
    required:[true,"Must write code"],

 },
starredBy:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:'User'
}]

},{timestamps:true});





// Snippet Model
const Snippet: Model<ISnippet> = mongoose.model<ISnippet>("Snippet", snippetSchema);
export default Snippet;
