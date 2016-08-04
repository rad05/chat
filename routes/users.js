var express = require('express');
var userHandler = require("../handlers/users");
var router = express.Router();





/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(res.io)
  //res.io.emit("socketToMe", "users");
  //res.send('respond with a resource.');
});


router.get('/online', userHandler.getOnlineUsers);


module.exports = router;
