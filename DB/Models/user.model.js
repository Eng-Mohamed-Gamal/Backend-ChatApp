import { Schema, model } from "mongoose";


const userSchema =  new Schema({
    userName : {type : String , required : true } ,
    email : {type : String , required : true , unique : true},
    password : {type : String , required : true } ,
    profilePic : {
        secure_url: { type: String },
        public_id: { type: String },
    },
    baseSrc : {type : String, default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
    folderId: { type: String, unique: true },
    isLoggedIn : {type : Boolean , default : false , required : true}
},{timestamps: true})


const User = model("User" , userSchema)

export default User ;