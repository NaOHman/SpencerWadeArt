var http = require('http');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extend: false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')))

var urlparser = bodyParser.urlencoded({extended: false});

app.get('/buy', function(req,res){
    res.render('buy', null)
})

app.get('/', function(req,res){
    res.render('index', {pictures: [
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'},
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'},
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'}
    ]})
})

app.get('/about', function(req,res){
    res.render('about', null)
})

app.get('/technique', function(req,res){
    res.render('technique', null)
})

app.get('/store', function(req,res){
    res.render('store', null)
})

app.get('/gallery', function(req,res){
    res.render('gallery', {pictures: [
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'},
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'},
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', 
             description: "blah", 
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'}
    ]})
})

app.get('/contact', function(req,res){
    res.render('contact', null)
})

app.get('/commission', function(req,res){
    res.render('commission', null)
})

app.get('/admin', function(req,res){
    res.render('admin', null)
})

server.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server Listening on %s:%s", host, port);
})
