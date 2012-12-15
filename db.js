
var salt = 'yolado';

var moment = require('moment'),
	mongoose = require('mongoose'),
	sha256	 = require(__dirname + '/sha256');
mongoose.connect('mongodb://localhost/hackathon');

var Schema = mongoose.Schema;
var ObjectId = mongoose.ObjectId;

var userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  date: String,
  games: Array,
  recived: Array,
  xboxProfile: String,
  steamId: String
});

var gameSchema = new Schema({
  name: String,
  data: String,
  description: String,
  date: String,
  author: String
});

mongoose.model('user', userSchema);
var User = mongoose.model('user');

mongoose.model('games', gameSchema);
var Game = mongoose.model('games')

// Db Methods

module.exports.register = function (body, callback){
	var user = new User();
	user.username = body.username;
	user.password = sha256(body.password, salt);
	user.email    = body.email;	
	callback(user);
	user.save();
}


module.exports.addGameToUser = function  (username, gameId, dataGame, callback) {
	User.findOne({username: username}, function (err, user){
		var data = {gameData: dataGame, dateAdded: moment(), achivements: []}
		user.games[gameId] = data;
		var result = user;
		user.save();
		callback(result);
	});
}

module.exports.createGame = function (gameData, callback) {
	var game = new Game();
	game.name = gameData.name;
	game.description = gameData.description;
	game.data = JSON.stringify(gameData.data);
	game.date = moment();
	game.author = gameData.author;
	callback(game);
	game.save();
};

module.exports.addUserXboxProfile = function (username, profile, callback){
	User.findOne({username: username}, function (err, user){
		user.xboxProfile = profile;
		var result = user;
		user.save();
		callback(result);
	});
}

module.exports.addSteamProfile =function (username, steamUsername, callback) {

};

// Getters

module.exports.getUserDataByUsername = function (username, callback) {
	User.findOne({username: username}, function (err, user){
		callback(user);
	});
}

module.exports.getGameById = function (id, callback){
	Game.findById(id, function (err, game){
		callback(game);
	});
}

module.exports.getUserDataGameById = function (id, username, callback){
	User.find({username: username}, function (err, user){
		callback(user.games[id]);
	});
};

module.exports.getPublishedGames = function (callback){
	Game.find().all(function (err, games){
		if(err){
			console.log(err);
		}
		console.log(games);
		callback(games);
	});
};

module.exports.getRecivedGames = function (username, callback){
	User.findOne({username: username}, function (err, games){
		callback(games);
	});	
};