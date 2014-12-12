var http = require('http');
var https = require('https');
var express = require('express');
var path = require('path');
var url = require('url');
var logger = require('morgan');
var nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
var fs = require('fs');
var app = express();

//setting up the database
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://swart:bootsandcats@ds063330.mongolab.com:63330/artwork', {safe: true});
var collections = {art: db.collection('art'),
                   users: db.collection('users')};

app.use(function(req, res, next) {
	if (!collections.art) {
		return next(new Error('No Collections.'));
	}
	req.collections = collections;
	next();
});

var options = {
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./cert.pem')
}

var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(session({ secret: 'spencerLovesCats' })); // session secret
app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', ensureSecure);
app.use('/upload', ensureSecure);
app.use('/save', ensureSecure);
app.use('/remove', ensureSecure);
app.use('/signup', ensureSecure);

function ensureSecure(req, res, next){
    if (req.secure)
        next();
    else 
        res.redirect('https://' + req.headers.host + '/login')
}

require('./modules/authentication')(passport); // pass passport for configuration
require('./routes/routes.js')(app, mongoskin, path, passport);

server.listen(80, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server Listening on %s:%s", host, port);
})

var secureServer = https.createServer(options, app).listen(443, function() {
	var host = secureServer.address().address;
	var port = secureServer.address().port;
	
	console.log("HTTPS Server listening on %s:%s", host, port);
})
