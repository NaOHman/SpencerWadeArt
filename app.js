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
        res.render('store', {pictures: [
            {imgsrc: 'images/3.jpg', 
                title: 'Awesome Cat', 
                description: "blah", 
                date: "January 4th, 1991", 
                medium:"Acrylic on canvas",
                size:400,
                price: 1000000,
                width: 20,
                height: 20,
                alt: 'img03'},
            {imgsrc: 'images/3.jpg', 
                title: 'Cute Cat', 
                description: "blah", 
                date:"January 1st, 1991", 
                medium:"Oil on canvas",
                size:240,
                price:1000001,
                width:12.5,
                height:20,
                alt: 'img03'},
            {imgsrc: 'images/3.jpg', 
                title: 'Sweet Cat', 
                description: "blah", 
                date:"January 5th, 1991", 
                medium:"Pencil",
                size: 200,
                price: 1000050,
                width: 12,
                height: 20,
                alt: 'img03'},
            {imgsrc: 'images/3.jpg', 
                title: 'Adorable Cat', 
                description: "blah", 
                date:"January 3rd, 1991", 
                medium:"Pastel",
                size: 300,
                price: 1000000000,
                width: 10,
                height: 30,
                alt: 'img03'},
            {imgsrc: 'images/3.jpg', 
                title: 'Sassy Cat', 
                description: "blah", 
                date:"January 2nd, 1991", 
                medium:"Acrylic on canvas",
                size: 600,
                price: 100,
                width: 20,
                height: 30,
                alt: 'img03'}
    ]})
})

app.get('/checkout', function(req,res){
    res.render('checkout', null)
})

app.get('/gallery', function(req,res){
    res.render('gallery', {pictures: [
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', 
             description: "blah", size: '16x9', price: '$1000',
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', 
             description: "blah", size: '16x9', price: '$1000',
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', 
             description: "blah", size: '16x9', price: '$1000',
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'},
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', 
             description: "blah", size: '16x9', price: '$1000',
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', 
             description: "blah", size: '16x9', price: '$1000',
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', 
             description: "blah", size: '16x9', price: '$1000',
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'},
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', 
             description: "blah", size: '16x9', price: '$1000',
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', 
             description: "blah", size: '16x9', price: '$1000',
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', 
             description: "blah", size: '16x9', price: '$1000',
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
     res.render('admin', {pictures: [
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', subtile: 'subtitle thing',
             description: "blah", size: '16x9', price: '$1000', forSale: false, onHome: true,
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', subtile: 'subtitle thing',
             description: "blah", size: '16x9', price: '$1000',forSale: false, onHome: true,
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', subtile: 'subtitle thing',
             description: "blah", size: '16x9', price: '$1000',forSale: false, onHome: true,
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'},
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', subtile: 'subtitle thing',
             description: "blah", size: '16x9', price: '$1000',forSale: false, onHome: true,
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', subtile: 'subtitle thing',
             description: "blah", size: '16x9', price: '$1000',forSale: false, onHome: false,
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', subtile: 'subtitle thing',
             description: "blah", size: '16x9', price: '$1000',forSale: false, onHome: true,
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'},
            {imgsrc: 'images/1.jpg', title: 'Azuki bean', subtile: 'subtitle thing',
             description: "blah", size: '16x9', price: '$1000',forSale: true, onHome: false,
             imgthumb: 'images/thumbs/1.jpg', alt: 'img01'},
            {imgsrc: 'images/2.jpg', title: 'Azuki bean', subtile: 'subtitle thing',
             description: "blah", size: '16x9', price: '$1000',forSale: true, onHome: true,
             imgthumb: 'images/thumbs/2.jpg', alt: 'img01'},
            {imgsrc: 'images/3.jpg', title: 'Azuki bean', subtile: 'subtitle thing',
             description: "blah", size: '16x9', price: '$1000',forSale: false, onHome: true,
             imgthumb: 'images/thumbs/3.jpg', alt: 'img01'}
    ]})
})

app.get('/error', function(req,res){
    res.render('error', null)
})

server.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server Listening on %s:%s", host, port);
})
