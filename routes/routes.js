//used to parse image uploads
var formidable = require('formidable');
var fs = require('fs');
var stripe = require("stripe")("sk_test_okcgo9jT6TRRex0C8KQWifw8");

module.exports = function(app, mongoskin, path, passport, smtpTransport, url) {
    //GET ROUTES
    //the home page
    app.get('/', function(req,res){
        req.collections.art.find({onHome: true}).toArray(function(error, result){
            req.collections.infos.findOne({role: 'frontpagetext'}, function(error, frontpagedata){
                if (error)
                    return next(error);
                res.render('index', {pictures: result,
                                    frontpagetext: frontpagedata});
            });
        });
    });

   //the about page
    app.get('/about', function(req,res){
        req.collections.infos.findOne({role: 'bio'}, function(error, result){
            if (error)
                return next(error);
            res.render('about', {infos: result});
        });
    });

    //the admin page
    app.get('/admin', isLoggedIn, function(req,res){
        req.collections.art.find({}).toArray(function(error, peices){
            if (error)
                return next(error);
            res.render('admin', {pictures: peices});
        });
    });

    //the checkout page
    app.get('/checkout', function(req,res){
        myId = mongoskin.helper.toObjectID(req.query.picid);
        req.collections.art.findOne({_id: myId}, function(err, result){
            if (err)
                next(err);
            res.render('checkout', {art: JSON.stringify(result)})
        })
    });

    //the commission page
    app.get('/commission', function(req,res){
        res.render('commission', null)
    });


    //the contact page
    app.get('/contact', function(req,res){
        req.collections.infos.findOne({role: 'contact'}, function(error, result){
            if (error)
                return next(error);
            res.render('contact', {infos: result,});
        });
    });

    app.get('/edit', isLoggedIn, function(req,res){
        req.collections.infos.findOne({role: 'contact'}, function(error, contactData){
            if (error)
                return next(error);
            req.collections.infos.findOne({role: 'frontpagetext'}, function(error, frontpagedata){
                if (error)
                    return next(error);
                res.render('edit', {contact: contactData,
                                    frontpagetext: frontpagedata});
            });
        });
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
        req.collections.infos.findOne({role: 'technique'}, function(error, result){
            if (error)
                return next(error);
            sections = result.sections.length -1;
            res.render('edittechnique', {infos: result,
                                   n: sections});
        });
    });
 
    //something went wrong
    app.get('/error', function(req,res){
        res.render('error', null)
    });

    //the gallery page
    app.get('/gallery', function(req,res){
        req.collections.art.find({}).toArray(function(error, result){
            if (error)
                return next(error);
            res.render('gallery', {pictures: result});
        });
    });

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
        
    //route for sending email
    app.get('/send',function(req,res) {
        var to = "Dum Dum <spencerwadetest@gmail.com>";
        req.collections.infos.findOne({role: 'email'}, function(error, result){
            if(result) {
                to = result;
            }
            else {
                console.log("There was a problem getting the email. Using default")
            }
        });
        var query = url.parse(req.url, true).query;
        var from = query.sendername+" <"+query.from+">";
        var subject = query.subject;
        var text = query.message;
        smtpTransport.sendMail({
            from: from,
            to: to,
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

    //the store page
    app.get('/store', function(req,res){
        req.collections.art.find({forSale: true}).toArray(function(error, peices){
            if (error)
                return next(error);
            res.render('store', {pictures: peices});
        });
    })

    //the technique page
    app.get('/technique', function(req,res){
        req.collections.infos.findOne({role: 'technique'}, function(error, result){
            if (error)
                return next(error);
            res.render('technique', {infos: result,});
        });
    })
   //Stripe payment
    app.post('/charge', function(req, res) {
        var stripeToken = req.body.stripeToken;
        var stripeEmail = req.body.stripeEmail;
        var amount = req.body.data-amount
        var charge = stripe.charges.create({
            amount: amount, // amount in cents, again
            currency: "usd",
            card: stripeToken,
            description: stripeEmail 
        }, function(err, charge) {
            if (err && err.type === 'StripeCardError') {
                // The card has been declined
            } else {
                //Render a thank you page called "Charge"
                myId = mongoskin.helper.toObjectID(req.body.artId);
                req.collections.art.update({_id: myId},{$set: {forSale: false}}, function(err, response){
                    res.render('charge', { title: 'Charge' });
                });
            }
        });
    });

    app.get('/charge', function(req,res){
        res.render('charge', null)
    });
   
    //POST routes
    //route for updating artwork from the admin page
    app.post('/save', isLoggedIn, function(req, res){
        var fields = req.body;
        var myId = mongoskin.helper.toObjectID(fields.artId);
        delete(fields.artId);
        fields = formToDB(fields);
        req.collections.art.update({_id: myId},{$set: fields}, function(err, response){
            if (err)
                console.log(err);
            res.send(200);
        })
    });

    app.post('/contactinfo', isLoggedIn, function(req, res){
        req.collections.infos.update({role: 'contact'},
            {$set : req.body},
            {upsert: true}, 
            function(err, response){
                if (err)
                    next(err);
                res.redirect('/edit');
            }
        );
    });

    app.post('/logo', isLoggedIn, function(req, res){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            //`file` is the name of the <input> field of type `file`
            var old_path = files.fileUpload.path,
            new_path = path.join(__dirname,'../', 'public','images', 'logo');
            fs.readFile(old_path, function(err, data) {
                fs.writeFile(new_path, data, function(err) {
                    fs.unlink(old_path, function(err) {
                        if (err) {
                            res.status(500);
                            res.json({'success': false});
                        } else {
                            res.redirect('/edit');
                        }
                    });
                });
            });
        });
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
        req.collections.infos.update({role: 'technique'},
            {$set : {sections: fieldsToArray(req.body),
                     videourl: req.body.videourl}},
            {upsert: true}, 
            function(err, response){
                if (err)
                    next(err);
                res.redirect('/edittechnique');
            }
        );
    });
   
    app.post('/frontpagetext', isLoggedIn, function(req, res){
        req.collections.infos.update({role: 'frontpagetext'},
            {$set : {text: req.body.frontpagetext}},
            {upsert: true}, 
            function(err, response){
                if (err)
                    next(err);
                res.redirect('/edit');
            }
        );
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/admin',
        failureRedirect: '/login/',
        failureFlash: true
    }));

    app.post('/logo', isLoggedIn, function(req, res){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            //`file` is the name of the <input> field of type `file`
            var old_path = files.fileUpload.path,
            new_path = path.join(__dirname,'../', 'public','images', 'logo');
            fs.readFile(old_path, function(err, data) {
                fs.writeFile(new_path, data, function(err) {
                    fs.unlink(old_path, function(err) {
                        if (err) {
                            res.status(500);
                            res.json({'success': false});
                        } else {
                            res.redirect('/edit');
                        }
                    });
                });
            });
        });
    });

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

    app.post('/save', isLoggedIn, function(req, res){
        var fields = req.body;
        var myId = mongoskin.helper.toObjectID(fields.artId);
        delete(fields.artId);
        fields = formToDB(fields);
        req.collections.art.update({_id: myId},{$set: fields}, function(err, response){
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
};

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
    fields.cents = 100 * fields.price;
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
    return arr;
}

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}
