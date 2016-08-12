var userModel = require('../models/user')
var messageModel = require('../models/message')
var adminUsers ={}
var users ={}
var responseJSON = {
    "status": 1,
    "msg": "success"
};




 function isUserNameUnique(userName,callback){
     userModel.user.findOne({userName:userName},{userName:1},function(userNameErr,userNameFound){
         if(userNameErr){
             throw userNameErr
         }
         if(userNameFound==null){
             callback(null,null)
         }
         else
         {
            callback(null,userNameFound.userName)
        }
     })
 }


function insertUserRegistrationData(firstName,lastName,userName,password,callback){
    var userData = new userModel.user({
        firstName: firstName,
        lastname: lastName,
        userName:userName,
        password:password
    })
    userData.save(function (savingUserDataErr, userDataSaved) {

        if (savingUserDataErr) {
             callback(savingUserDataErr)
        }
        else{
           callback(null,userDataSaved)

        }
    })
}

function validateloginCreds(name,password,callback) {

    userModel.user.findOne({userName: name, password: password}, {
        _id: 1,
        admin: 1,
        userName: 1,
        firstName:1,
        lastName:1
    }, function (userFoundErr, userFound) {
        if(userFoundErr){
            callback(userFoundErr)
        }
        callback(null,userFound)

    })
}


// ALL API"s


function registerUser(req,res,next){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userName= req.body.userName;
    var password = req.body.password;
    // check for userName
    isUserNameUnique(userName,function(userNameUniqueErr,userNameUniqueCheck){
        console.log("value from username unique calback ")
        console.log(userNameUniqueCheck)
        if(userNameUniqueErr){
            throw userNameUniqueErr
        }
        if(userNameUniqueCheck==null){  // no username found
            insertUserRegistrationData(firstName,lastName,userName,password,function(insertUserDataErr,insertUserData){
                if(insertUserDataErr){
                    throw insertUserDataErr
                }
                // console.log(insertUserData)
                responseJSON.msg = "registeration is successful"
                res.send(responseJSON)
            })

        }
        else{
            console.log("userName presetn")
            responseJSON.msg = "userName is not unique"
            res.send(responseJSON)
        }

    })

}


function validateUserAtLogin(req,res,next){
    var nameAtLogin = req.query.userName
    var passwordAtLogin = req.query.password



    validateloginCreds(nameAtLogin,passwordAtLogin,function(userFoundErr,userFound){

        if(userFoundErr){
            throw userFoundErr
        }
        if(userFound==null || !userFound){
            responseJson={}
            responseJson.status =0
            responseJson.msg = "validation failed"
            res.send(responseJson)

        }
        else {
            // if the user is a regular client (not an admin)
            if (!userFound.admin) {
                res.io.userName = userFound.userName
                res.io.admin=1
                //res.io.admin=1
                users[res.io.userName] = res.io
                //var onlineUsers = Object.keys(users)
                responseJSON.role =0
                res.send(responseJSON)
                return
            }
           if(userFound.admin){
                res.io.userName = userFound.firstName
                adminUsers[res.io.userName] = res.io
                responseJSON.role =1
                res.send(responseJSON)
                return
           }
        }
    })


}


function getOnlineUsers(req,res,next){
    /*console.log("USERS")
    console.log(users)
    console.log("ADMIN USERS")
    console.log(adminUsers)*/

    var onlineUsers = Object.keys(users)
    var onlineAdminUsers = Object.keys(adminUsers)
    if(!onlineUsers.length && !onlineAdminUsers.length){
        responseJSON.onlineUsers= "no users online"
        res.send(responseJSON)
        return
    }
    console.log("the users online are")
    console.log(onlineUsers)
    console.log("the admin online are")
    console.log(adminUsers)
    responseJSON.onlineUsers = onlineUsers
    responseJSON.onlineAdmin = onlineAdminUsers
    res.send(responseJSON)
    return

}

//gets the admin firstName ,the client's userName and the message
// to , from , message
function sendMessage(req,res,next){
 var to =req.query.to //username : s , firstName: waldo
    var from = req.query.from
    var message = req.query.message
    if(res.io.admin){

    }

        /*
         users[sendmessageTo].emit('private message',{msg:message,nickName:socket.nickname,admin:1,to:to}) // betty(me) sending messages to ronnie(you)
         //socket.emit('private message',{msg:message,nickName:socket.nickname })
         socket.emit('private message',{msg:message,nickName:socket.admin,ack:'ok',admin:1,to:to})
         io.to(receiversSocket.id).emit('notification', {sentBy:socket.nickname})
         */


}






function disconnect(req,res,next){
    var userName =req.query.userName
    //console.log(adminUsers)
    //console.log(users)
    console.log(Object.keys(adminUsers))
    console.log(Object.keys(users))
        // set status to false in connections where admin:this.admin
        // update count to 0
      //  delete socketInfo[socket.admin]





}









exports.validateUserAtLogin = validateUserAtLogin;
exports.getOnlineUsers = getOnlineUsers
//exports.getOnlineAdmin= getOnlineAdmin
exports.register = registerUser
exports.disconnect = disconnect



