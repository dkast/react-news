var Parse = require('parse').Parse;

var generateUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

var getAppTitle = function() {
	var appTitle;
	Parse.Config.get().then(function(config) {
		console.log("Yay! Config was fetched from the server.");

		appTitle = config.get("appTitle");
		console.log(appTitle);
		return appTitle;
	}, function(error) {
		console.log("Failed to fetch. Using Cached Config.");

		var config = Parse.Config.current();
		appTitle = config.get("appTitle");
		if (appTitle === undefined) {
			appTitle = "React News";
		}
		console.log(appTitle);
		return appTitle;
	});
};

exports.generateUUID = generateUUID;
exports.getAppTitle = getAppTitle;
