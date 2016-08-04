var nconf = require("nconf");
var path = require("path");

function Config() {
    nconf.argv().env("");
    var environment = nconf.get("NODE:ENV") || "development";
    nconf.file(environment, path.resolve(__dirname, "../configs/"+environment+".json"));
    nconf.file("default", path.resolve(__dirname, "../configs/default.json"));
}

Config.prototype.get = function (key) {
    return nconf.get(key);
};

module.exports = new Config();

