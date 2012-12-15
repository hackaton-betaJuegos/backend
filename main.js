var db    = require(__dirname + '/db'),
  express = require('express'),
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

app.post('/register', function (req, res){
  var post = req.body;
  db.register(post, function (user) {
    res.send(user);
  });
});

app.get('/api/:username', function (req, res){
  db.getUserDataByUsername(req.params.username, function (user){
    res.send(user);
  });
});

app.get('/addGame', function (req, res){
  res.render('addgame.jade');
});

app.post('/api/addGame', function (req, res){
  db.createGame(req.body, function (game) {
    res.send(game);
  });
});

app.get('/api/publishedGames', function (req, res){
  db.getPublishedGames(function (games){
    res.send(games);
  });
});

app.get('/api/addXbox/:username/:profile', function (req, res){
  db.addUserXboxProfile(req.params.username, req.params.profile, function (user) {
    res.send(user);
  });
});

app.get('/:username/xbox', function (req, res){
  db.getUserDataByUsername(req.params.username, function (username){
  	var gamertag = username.xboxProfile;
    xbox.getProfileFromGamertag(gamertag, function (profile){
  		xbox.getGamesFromGamertag(gamertag, function (games) {
  			res.render('xbox_profile.jade', {profile: profile.Data, games: games.Data, route: req.params.username});
  		});
  	});
  });
});
app.listen(80);
