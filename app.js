var http = require('http');
<<<<<<< HEAD
var formidable = require('formidable');
var express = require('express');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var Thumbnail = require('thumbnail');
var thumb = new Thumbnail(path.join(__dirname, 'public','images'),
                          path.join(__dirname, 'public','images','thumbs'));
//var busboy = require('connect-busboy');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/artwork', {safe: true});
var collections = {art: db.collection('art')};

=======
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
>>>>>>> 20226a91816ddf7bbc10c536b84fec9cace707c0
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(logger('dev'));
<<<<<<< HEAD
//app.use(busboy());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	if (!collections.art) {
		return next(new Error('No Collections.'));
	}
	req.collections = collections;
	next();
});

function monthToN(month){
    return ['---','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Nov','Dec'].indexOf(month);
}

app.post('/upload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //`file` is the name of the <input> field of type `file`
        var old_path = files.fileUpload.path,
        file_size = files.fileUpload.size,
        file_ext = files.fileUpload.name.split('.').pop(),
        index = old_path.lastIndexOf('/') + 1,
        file_name = old_path.substr(index),
        src_name = path.join('images', file_name + '.' + file_ext),
        new_path = path.join(__dirname, 'public','images', file_name + '.' + file_ext);
        fs.readFile(old_path, function(err, data) {
            fs.writeFile(new_path, data, function(err) {
                fs.unlink(old_path, function(err) {
                    if (err) {
                        res.status(500);
                        res.json({'success': false});
                    } else {
                        thumb.ensureThumbnail(file_name+'.'+file_ext, null, 250, function(err, filename){
                           if (err)
                               throw err;
                           fields.imgthumb = path.join('images','thumbs',filename);
                            fields.imgsrc = src_name;
                            fields.medium = fields.medium.charAt(0).toUpperCase() + fields.medium.slice(1).toLowerCase();
                            fields.alt = fields.title;
                            fields.size = fields.height * fields.width;
                            fields.dim = fields.width + 'x' + fields.height;
                            fields.date = fields.year;
                            fields.numdate = (fields.year*1000) + (monthToN(fields.month)*100) + fields.day;
                            if (fields.depth != '')
                                    fields.dim = fields.dim +'x' + fields.depth;
                            if (fields.month != ''){
                                if (fields.day == '')
                                    fields.date = fields.month + ' ' + fields.date;
                                else
                                    fields.date = fields.month + ' '+ fields.day +', ' + fields.date;
                            }
                            if (fields.hasOwnProperty('forSale'))
                                fields.forSale = true;
                            else
                                fields.forSale = false;
                            if (fields.hasOwnProperty('onHome'))
                                fields.onHome = true;
                            else
                                fields.onHome = false;
                            req.collections.art.insert(fields, function(error,response){
                                if (error)
                                    throw error;
                                res.redirect('/admin');
                            });
                        });
                    }
                });
            });
        });
    });
});
=======
app.use(bodyParser.urlencoded({extend: false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')))

var urlparser = bodyParser.urlencoded({extended: false});
>>>>>>> 20226a91816ddf7bbc10c536b84fec9cace707c0

app.get('/buy', function(req,res){
    res.render('buy', null)
})

app.get('/', function(req,res){
<<<<<<< HEAD
    req.collections.art.find({onHome: true}).toArray(function(error, result){
        if (error)
            return next(error);
        res.render('index', {pictures: result});
    });
});
=======
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
>>>>>>> 20226a91816ddf7bbc10c536b84fec9cace707c0

app.get('/about', function(req,res){
    res.render('about', null)
})

app.get('/technique', function(req,res){
    res.render('technique', null)
})

app.get('/store', function(req,res){
<<<<<<< HEAD
    req.collections.art.find({forSale: true}).toArray(function(error, peices){
        if (error)
            return next(error);
        res.render('store', {pictures: peices});
    });
=======
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
>>>>>>> 20226a91816ddf7bbc10c536b84fec9cace707c0
})

app.get('/checkout', function(req,res){
    res.render('checkout', null)
})

app.get('/gallery', function(req,res){
<<<<<<< HEAD
    req.collections.art.find({}).toArray(function(error, result){
        if (error)
            return next(error);
        res.render('gallery', {pictures: result});
    });
});

app.get('/contact', function(req,res){
    res.render('contact', null)
});

app.get('/commission', function(req,res){
    res.render('commission', null)
});

app.get('/admin', function(req,res){
    req.collections.art.find({}).toArray(function(error, peices){
        if (error)
            return next(error);
        res.render('admin', {pictures: peices});
    });
});

app.get('/error', function(req,res){
    res.render('error', null)
});
=======
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
>>>>>>> 20226a91816ddf7bbc10c536b84fec9cace707c0

server.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server Listening on %s:%s", host, port);
})
