
var mongoose = require('mongoose');
var Schema=  mongoose.Schema;

//{type: String, trim: true},
var userSchema = new Schema({
    firstName:String,
    lastName:String,
    userName: {type:String},//unique:true // admin
    password:String,
    admin:{type:String,unique:true},// this has to be made unique
    accountName : {type:String,unique:true},
    loginStatus: Number,
    role:Number ,
    chatguid:String,
    sessionID:String,
    count:{type:Number, default:0},
    //connections:[{type:String}],
    creationDate: {type:Number, default:Date.now()},
    modificationDate: {type: Number, default:Date.now()}
});








var user = mongoose.model('users', userSchema, 'users');


exports.user = user;



// role 1- admin  if role field exists , user is an admin
