import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for Comment Document
export interface IComment extends Document {
  user:mongoose.Types.ObjectId,
  snippet:mongoose.Types.ObjectId,
  content:string
}

const commentSchema: Schema<IComment> = new Schema({
 user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
 },
snippet:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Snippet",
    required:true
},
 content:{
    type:String,
    required:[true,"Must select a language"],

 }

},{timestamps:true});





// Comment Model
const Comment: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
