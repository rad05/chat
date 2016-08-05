var userModel = require('../models/user')
var messageModel = require('../models/message')
var adminUsers ={}
var users ={}
var responseJSON = {
    "status": 1,
    "msg": "success"
};


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
    var onlineUsers = Object.keys(users)
    if(!onlineUsers.length){
        responseJSON.onlineUsers= "no users online"
        res.send(responseJSON)
        return
    }
    console.log(onlineUsers)
    responseJSON.onlineUsers = onlineUsers
    res.send(responseJSON)
    return

}


function getOnlineAdmin(req,res,next){
    var onlineAdmin =  Object.keys(adminUsers)
    if(!onlineAdmin .length){
        responseJSON.onlineAdmin= "no admin online"
        res.send(responseJSON)
        return
    }
    responseJSON.onlineAdmin = onlineAdmin
    res.send(responseJSON)
    return

}


function disconnect(req,res,next){
    var userName =req.query.userName
    console.log(adminUsers)
    console.log(users)
    Object.keys(adminUsers)
        // set status to false in connections where admin:this.admin
        // update count to 0
      //  delete socketInfo[socket.admin]





}









exports.validateUserAtLogin = validateUserAtLogin;
exports.getOnlineUsers = getOnlineUsers
exports.getOnlineAdmin= getOnlineAdmin
exports.disconnect = disconnect



