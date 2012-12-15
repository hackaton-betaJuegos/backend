var db    = require(__dirname + '/db'),
  express = require('express'),
	request = require('request'),
  moment  = require('moment'),
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

app.get('/', function (req, res){
  res.render('index');
});

app.get('/register', function (req, res){
	res.render('register.jade');
});

app.post('/register', function (req, res){
  var post = req.body;
  db.register(post, function (user) {
    res.redirect('/'+user.username);
  });
});

app.get('/login', function (req, res){
  res.render('login');
});

app.post('/goUser', function (req, res){
  res.redirect('/'+req.body.user);
});

app.get('/api/user/:username', function (req, res){
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

app.get('/api/addGameToUser/:username/:id', function (req, res){
  db.addGameToUser(req.params.username, req.params.id, function (data) {
    res.send(data);
  });
});

app.get('/api/games', function (req, res){
  db.getGames(function (games){
    res.send(games);
  });
});

app.post('/api/addXboxProfile/:username', function (req, res){
  db.addUserXboxProfile(req.params.username, req.body.gamertag, function (user) {
    res.redirect('/'+user.username+'/xbox');
  });
});

app.get('/:username', function (req, res){
  db.getUserDataByUsername(req.params.username, function (user){
    res.render('profile.jade', {user: user, route: req.params.username});
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

app.get('/:profile/xbox/achivements/:id', function (req, res){
  db.getUserDataByUsername(req.params.profile, function (username){
    console.log(username);
    xbox.getAchivementsFromIdAndGamertag(req.params.id, username.xboxProfile, function (achivements) {
      res.render('achivements.jade', {route: req.params.profile, game: achivements.Data});
    });
  });
});
app.listen(80);