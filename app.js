var http = require('http');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require("body-parser");

//setting up the database
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/artwork', {safe: true});
var collections = {art: db.collection('art')};

var app = express();
var server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	if (!collections.art) {
		return next(new Error('No Collections.'));
	}
	req.collections = collections;
	next();
});

require('./routes/routes.js')(app, mongoskin, path);

server.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server Listening on %s:%s", host, port);
})
