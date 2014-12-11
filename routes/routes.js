//used to parse image uploads
var formidable = require('formidable');
var fs = require('fs');

module.exports = function(app, mongoskin, path) {

    //route for updating artwork from the admin page
    app.post('/save', function(req, res){
        var fields = req.body;
        var myId = mongoskin.helper.toObjectID(fields.artId);
        delete(fields.artId);
        fields = formToDB(fields);
        req.collections.art.update({_id: myId},{$set: fields}, function(err, response){
            if (err)
                console.log(err);
            res.redirect('/admin')
        })
    });

    //route for removing artwork from the admin page
    app.post('/remove', function(req, res){
        myId = mongoskin.helper.toObjectID(req.body.myId);
        imgPath = path.join(__dirname, '../', 'public', req.body.imgPath);
        fs.unlink(imgPath, function(err, fd){
            if (err)
                console.log(err);
        });
        req.collections.art.remove({"_id": myId}, function(err, response){
            if (err)
                console.log(err);
            res.send({success: true});
        })
    });

    //route for adding artwork from the admin page
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
            new_path = path.join(__dirname,'../', 'public','images', file_name + '.' + file_ext);
            fs.readFile(old_path, function(err, data) {
                fs.writeFile(new_path, data, function(err) {
                    fs.unlink(old_path, function(err) {
                        if (err) {
                            res.status(500);
                            res.json({'success': false});
                        } else {
                           fields.imgsrc = src_name;
                           fields = formToDB(fields);
                           req.collections.art.insert(fields, function(error,response){
                               if (error)
                                   throw error;
                               res.redirect('/admin');
                           });
                        }
                    });
                });
            });
        });
    });

    //the home page
    app.get('/', function(req,res){
        req.collections.art.find({onHome: true}).toArray(function(error, result){
            if (error)
                return next(error);
            res.render('index', {pictures: result});
        });
    });

    //the about page
    app.get('/about', function(req,res){
        res.render('about', null)
    })

    //the technique page
    app.get('/technique', function(req,res){
        res.render('technique', null)
    })

    //the store page
    app.get('/store', function(req,res){
        req.collections.art.find({forSale: true}).toArray(function(error, peices){
            if (error)
                return next(error);
            res.render('store', {pictures: peices});
        });
    })

    //the checkout page
    app.get('/checkout', function(req,res){
        res.render('checkout', null)
    })

    //the gallery page
    app.get('/gallery', function(req,res){
        req.collections.art.find({}).toArray(function(error, result){
            if (error)
                return next(error);
            res.render('gallery', {pictures: result});
        });
    });

    //the contact page
    app.get('/contact', function(req,res){
        res.render('contact', null)
    });

    //the commission page
    app.get('/commission', function(req,res){
        res.render('commission', null)
    });

    //the admin page
    app.get('/admin', function(req,res){
        req.collections.art.find({}).toArray(function(error, peices){
            if (error)
                return next(error);
            res.render('admin', {pictures: peices});
        });
    });

    //something went wrong
    app.get('/error', function(req,res){
        res.render('error', null)
    });

    //required to make sorting by date work properly
    function monthToN(month){
        return ['---','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Nov','Dec'].indexOf(month);
    }

    //performs transformations on the form data so that
    //the database contains more useful information
    function formToDB(fields){
        fields.medium = fields.medium.charAt(0).toUpperCase() + fields.medium.slice(1).toLowerCase();
        fields.alt = fields.title;
        fields.size = fields.height * fields.width;
        fields.dim = fields.width + 'x' + fields.height;
        fields.date = fields.year;
        fields.numdate = (fields.year*1000) + (monthToN(fields.month)*100) + fields.day;
        if (fields.depth != '')
               fields.dim = fields.dim +'x' + fields.depth;
        if (fields.month != '---'){
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
        return fields
    }
}
