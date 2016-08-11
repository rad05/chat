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
        if(userNameFound.userName){
            callback(null,userNameFound)
        }
     })
 }


function insertUserRegisrationData(firstName,lastName,userName,password,callback){
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





function registerUser(req,res,next){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userName= req.body.userName;
    var password = req.body.password;
    // check for userNsame
    isUserNameUnique(userName,function(userNameUniqueErr,userNameUniqueCheck){
        console.log("value from username unique calback ")
        console.log(userNameUniqueCheck)
        if(userNameUniqueErr){
            throw userNameUniqueErr
        }
        if(userNameUniqueCheck==1){  // no username found
            insertUserRegisrationData(firstName,lastName,userName,password,function(insertUserDataErr,insertUserData){
                if(insertUserDataErr){
                    throw insertUserDataErr
                }
                // console.log(insertUserData)
                responseJSON.msg = "usernsame unique"
                res.send(responseJSON)
            })

        }
        if(userNameUniqueCheck==0){
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

// get all users and admin online
/*function getOnlineAdmin(req,res,next){
    var onlineAdmin =  Object.keys(adminUsers)
    if(!onlineAdmin .length){
        responseJSON.onlineAdmin= "no admin online"
        res.send(responseJSON)
        return
    }
    responseJSON.onlineAdmin = onlineAdmin
    res.send(responseJSON)
    return

}*/


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



