const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const passportLocalMongoose = require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type: String,
        required: true
    },


});

userSchema.plugin(passportLocalMongoose);//why we use plugin because by default username hashing and salting automatically implement

module.exports= mongoose.model('User',userSchema) 