//used to parse image uploads
var formidable = require('formidable');
var fs = require('fs');

module.exports = function(app, mongoskin, path, passport) {

    app.get('/login', function(req, res){
        console.log("got here");
        res.render('login', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/admin',
        failureRedirect: '/login/',
        failureFlash: true
    }));

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    //route for updating artwork from the admin page
    app.post('/save', isLoggedIn, function(req, res){
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
    app.post('/editbio', isLoggedIn, function(req, res){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            //`file` is the name of the <input> field of type `file`
            if (files.fileUpload.size > 0){
                var old_path = files.fileUpload.path,
                file_ext = files.fileUpload.name.split('.').pop(),
                new_path = path.join(__dirname,'../', 'public','images', 'spencer' +'.' +file_ext);
                img_path = path.join('images', 'spencer' + '.' + file_ext)
                fs.readFile(old_path, function(err, data) {
                    fs.writeFile(new_path, data, function(err) {
                        fs.unlink(old_path, function(err) {
                            if (err) {
                                res.status(500);
                                res.json({'success': false});
                            } else {
                                req.collections.infos.update({role: 'bio'},
                                    {$set : {sections: fieldsToArray(fields),
                                             imgsrc: img_path}},
                                    {upsert: true}, 
                                    function(err, response){
                                        if (err)
                                            next(err);
                                        res.redirect('/editbio');
                                    }
                                );
                            }
                        });
                    });
                });
            } else {
                req.collections.infos.update({role: 'bio'},
                    {$set : {sections: fieldsToArray(fields)}},
                    {upsert: true}, 
                    function(err, response){
                        if (err)
                            next(err);
                        res.redirect('/editbio');
                    }
                );
            }
        });
    });

    app.post('/edittechnique', isLoggedIn, function(req, res){

    });
//	app.get('/signup', function(req, res) {
//
//		// render the page and pass in any flash data if it exists
//		res.render('signup.jade', { message: req.flash('signupMessage') });
//	});
//
//	// process the signup form
//	app.post('/signup', passport.authenticate('local-signup', {
//		successRedirect : '/admin',
//		failureRedirect : '/signup',
//		failureFlash : true // allow flash messages
//	}));

    //route for removing artwork from the admin page
    app.post('/remove', isLoggedIn, function(req, res){
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

    
    //route for sending email
    app.get('/send',function(req,res) {
        var query = url.parse(req.url, true).query;
        var from = query.sendername+" <"+query.from+">";
        var subject = query.subject;
        var text = query.message;
        smtpTransport.sendMail({
            from: from,
            to: "Dum Dum <spencerwadetest@gmail.com>",
            subject: subject,
            text: text
        }, function(error, response) {
            if(error) {
                console.log(error);
                res.send(500);
            }
            else {
                res.send(200);
                console.log("Message send: " + response.message);
            }
            smtpTransport.close();
        });
    });

    app.get('/edit', isLoggedIn, function(req,res){
        res.render('edit');
    });

    app.get('/editbio', isLoggedIn, function(req,res){
        req.collections.infos.findOne({role: 'bio'}, function(error, result){
            if (error)
                return next(error);
            sections = result.sections.length -1;
            res.render('editbio', {infos: result,
                                   n: sections});
        });
    });

    app.get('/edittechnique', isLoggedIn, function(req,res){
        res.render('edittechnique');
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
        req.collections.infos.findOne({role: 'bio'}, function(error, result){
            if (error)
                return next(error);
            sections = result.sections.length -1;
            res.render('about', {infos: result});
        });
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
    app.get('/admin', isLoggedIn, function(req,res){
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
};
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

function fieldsToArray(fields){
    var i = 0;
    var arr = []
    while(fields.hasOwnProperty("heading" + i)){
        arr.push({
            heading: fields["heading" + i],
            text: fields["text" + i]
        });
        i++;
    }
    console.log(fields);
    console.log(arr);
    return arr;
}

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}
