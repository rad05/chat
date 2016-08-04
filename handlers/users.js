var userModel = require('../models/user')
var messageModel = require('../models/message')
var adminUsers ={}
var users ={}

/*
 socket.on('login validation',function(loginInfo,callback){
 validateloginCreds(loginInfo,function(userFoundErr,userFound){
 if(userFoundErr){
 throw userFoundErr
 }
 if(userFound==null || !userFound){
 callback(false)
 }
 else{
 callback(true)
 if(userFound.admin){
 loginInfo.admin=userFound.admin
 socket.admin= userFound.admin
 socket.nickname = loginInfo.un
 socketInfo[socket.admin]=socket
 }
 else{
 socket.nickname = loginInfo.un
 users[socket.nickname]=socket
 }

 socket.emit('chat page',loginInfo)
 }
 })
 })
 */



function getOnlineUsers(req,res,next){
    //console.log(res.io)
    var nameAtLogin = req.query.userName
    var passwordAtLogin = req.query.password
    console.log(nameAtLogin)



    validateloginCreds(nameAtLogin,passwordAtLogin,function(userFoundErr,userFound){

        if(userFoundErr){
            throw userFoundErr
        }
        if(userFound==null || !userFound){
            responseJson={}
            responseJson.status =0
            responseJson.msg = "validation failed"
            res.send(responseJson)
            // send message
        }
        else {
            if (!userFound.admin) {
                /* if(userFound.admin){
                 /*console.log("user is an admin")
                 responseJson={}
                 res.io.userName = userFound.userName
                 res.io.admin = userFound.admin
                 adminUsers[res.io.admin]=res.io
                 console.log(Object.keys( adminUsers))

                 }*/

                console.log("user's not an admin !!")
                res.io.userName = userFound.userName
                users[res.io.userName] = res.io
                responseJson = {}
                console.log(Object.keys(users))
                var onlineUsers = Object.keys(users)
                responseJson={}
                responseJson.status =0
                responseJson.onlineUsers = onlineUsers
                res.json(responseJson)


            }
        }
    })


}


function validateloginCreds(name,password,callback) {

    userModel.user.findOne({userName: name, password: password}, {
        _id: 1,
        admin: 1,
        userName: 1,
    }, function (userFoundErr, userFound) {
        if(userFoundErr){
            callback(userFoundErr)
        }
        callback(null,userFound)

    })
}



exports.getOnlineUsers = getOnlineUsers;



