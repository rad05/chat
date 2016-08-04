var mongoose = require('mongoose');
var Schema=  mongoose.Schema;


var messageSchema = new Schema({
    user:Object, //{_id:'',userName:''}
    message:String,
    to: Object,  //{_id:'',userName:''}  //operator's userName and ID,
    originalServerAdmin : Object,
   chatguid:String,
   sessionID:String,
   offline:Boolean,
  
    creationDate: {type:Number, default:Date.now()},
    modificationDate: {type: Number, default:Date.now()}
});



var connectionSchema = new Schema({
    admin:String,
    userName:String,
    status:Boolean,
    creationDate: {type:Number, default:Date.now()},
    modificationDate: {type: Number, default:Date.now()}
})






var message = mongoose.model('messages', messageSchema, 'messages');
var connection = mongoose.model('connections',connectionSchema,'connections')


exports.message = message;
exports.connection= connection;



// role 1- admin  if role field exists , user is an admin
