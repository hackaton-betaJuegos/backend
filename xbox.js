var request = require('request');

module.exports.getGamesFromGamertag = function (gamertag, callback){
	var url = 'http://www.xboxleaders.com/api/games.json?gamertag=' + gamertag;
	request.get(url, function (err, response, body){
		callback(JSON.parse(body));
	});
}

module.exports.getProfileFromGamertag = function (gamertag, callback){
	var url = 'http://www.xboxleaders.com/api/profile.json?gamertag=' + gamertag;
	request.get(url, function (err, response, body){
		callback(JSON.parse(body));
	});
}