var http = require('http');
var formidable = require('formidable');
var express = require('express');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var bodyParser = require("body-parser");
var Thumbnail = require('thumbnail');
var thumb = new Thumbnail(path.join(__dirname, 'public','images'),
                          path.join(__dirname, 'public','images','thumbs'));
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/artwork', {safe: true});
var collections = {art: db.collection('art')};
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

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

function monthToN(month){
    return ['---','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Nov','Dec'].indexOf(month);
}


app.put('/save/:id', function(req, res){
    console.log(req.params.id);
    res.send({success: true})
});

app.put('/remove', function(req, res){
    console.log("Remove " + req.params.id);
    res.send({success: true});
});

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

app.get('/buy', function(req,res){
    res.render('buy', null)
})

app.get('/', function(req,res){
    req.collections.art.find({onHome: true}).toArray(function(error, result){
        if (error)
            return next(error);
        res.render('index', {pictures: result});
    });
});

app.get('/about', function(req,res){
    res.render('about', null)
})

app.get('/technique', function(req,res){
    res.render('technique', null)
})

app.get('/store', function(req,res){
    req.collections.art.find({forSale: true}).toArray(function(error, peices){
        if (error)
            return next(error);
        res.render('store', {pictures: peices});
    });
})

app.get('/checkout', function(req,res){
    res.render('checkout', null)
})

app.get('/gallery', function(req,res){
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

server.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server Listening on %s:%s", host, port);
})
