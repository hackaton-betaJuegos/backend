var express = require('express'),
	request = require('request');
// 	steam = require(__dirname + '/steam'),
 	xbox = require(__dirname + '/xbox');

var app = express();

app.configure(function (){
  app.use(express.static(__dirname + '/static'));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  //app.use(express.session({store: MemoryStore({reapInterval : 60000*10}), secret: "moodlesuck"}));
  app.use(app.router);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: true
  });
});

app.get('/register', function (req, res){
	res.render('register.jade');
});

app.get('/:profile/xbox', function (req, res){
	var gamertag = req.params.profile
	xbox.getProfileFromGamertag(gamertag, function (profile){
		xbox.getGamesFromGamertag(gamertag, function (games) {
			res.render('xbox_profile.jade', {profile: profile.Data, games: games.Data, route: req.params.profile});
		});
	});
});

// http://www.xboxleaders.com/api/games.json?gamertag=

// 'http://www.xboxleaders.com/api/profile.json?gamertag=ESPGeekGamer

// https://avatar-ssl.xboxlive.com/avatar/ESPGeekGamer/avatar-body.png

app.listen(80);
