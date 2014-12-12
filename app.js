var http = require('http');
var express = require('express');
var path = require('path');
var url = require('url');
var fs = require('fs');
var logger = require('morgan');
var io = require('socket.io')(server);
var nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
//setting up the database
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/artwork', {safe: true});
var collections = {art: db.collection('art')};

var app = express();
var server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next) {
	if (!collections.art) {
		return next(new Error('No Collections.'));
	}
    if(err.status==404) {
        res.render('error');
    }
	req.collections = collections;
	next();
});

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "localhost", //set to localhost when using fakeSMTP
    auth: {
        user: "spencerwadetest@gmail.com",
        pass: "bootsandcats"
    }
});

require('./routes/routes.js')(app, mongoskin, path, smtpTransport);

server.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server Listening on %s:%s", host, port);
})
