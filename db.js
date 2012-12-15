
var salt = 'yolado';

var moment = require('moment'),
	mongoose = require('mongoose'),
	sha256	 = require(__dirname + '/sha256'),
	gravatar = require('gravatar');
mongoose.connect('mongodb://localhost/hackathon');

var Schema = mongoose.Schema;
var ObjectId = mongoose.ObjectId;

var userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  date: String,
  games: String,
  recived: Array,
  xboxProfile: String,
  steamId: String,
  avatar: String
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

mongoose.model('game', gameSchema);
var Game = mongoose.model('game');

// Db Methods

module.exports.register = function (body, callback){
	var user = new User();
	user.username = body.username;
	user.password = sha256(body.password, salt);
	user.email    = body.email;
	user.avatar   = gravatar.url(body.email);
	user.date 	  = moment();
	callback(user);
	user.save();
}


module.exports.addGameToUser = function  (username, gameId, callback) {
	User.findOne({username: username}, function (err, user){
		var data = {dateAdded: moment(), _id: user._id}
		if (user.games){
			user.games += JSON.stringify(data)+',';
		} else{
			user.games = JSON.stringify(data)+',';
		}
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
	var result = game;
	game.save();
	callback(result);
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
}

module.exports.getGames = function (callback){
	Game.find({}, function (err, games){
		callback(games);
	});
};

module.exports.getRecivedGames = function (username, callback){
	User.findOne({username: username}, function (err, games){
		callback(games);
	});	
};