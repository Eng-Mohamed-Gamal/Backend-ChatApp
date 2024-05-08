import { Schema, Types, model } from "mongoose";


const messageSchema = new Schema({
    sender : {type : Types.ObjectId , required : true , ref : "User"} ,
    content : {type : String , required : true },
    chat : {type : Types.ObjectId , required : true , ref : "Chat"}
},{timestamps : true})





const Message = model("Message" , messageSchema)


export default Message ;