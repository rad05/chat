var mongoose = require('mongoose');
var config = require('../libs/config');

// Build the connection string
console.log("starting !!!!")

var dbURI = 'mongodb://localhost/'+config.get("database:mongo:name");
//var dbURI = 'mongodb://localhost/'

// Create the database connection
mongoose.connect(dbURI);
//mongoose.connect('mongodb://localhost/chat');

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

