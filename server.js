'use strict';
const express = require('express');
var path = require("path");
var uuid = require("uuid");
var bodyParser = require('body-parser');
var http = require('http');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');

const app = express();

const cocoshanerca  = require(process.cwd() +'/app/app.js');


app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

app.set('view engine', 'ejs');


// Allow cross origin resource sharing (CORS) within our application
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //


app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));


//Passport config za logovanje

app.use(passport.initialize());
app.use(passport.session());

require('./app/config/passport.js')(passport);

app.post('/admin/dashboard',cocoshanerca.user.loginAdminUser, passport.authenticate('local'), function (req, res, next) {

});


app.post('/admin/addNewCategory', cocoshanerca.posts.addNewCategory, function (req, res) {

});

app.post('/admin/addNewUser', cocoshanerca.user.addNewUser, function (req, res) {

});


app.post('/cat/update', function (req, res, next) {

    cocoshanerca.category.updateCategory.updateQuery(req, res);

});


// Admin get rute 
app.get('/admin/dashboard',ensureAuthenticated, function(req, res){
    res.render('admin/dashboard', {
        title:'Cocoshanerca | Admin Dashboard'
    });
});

app.get('/admin/add-new-user',ensureAuthenticated, function(req, res){
    res.render('admin/add-new-user', {

    });
});

app.get('/admin/add-new-post', ensureAuthenticated, cocoshanerca.posts.addNewPost, function(req, res){

});

app.get('/admin/all-posts', ensureAuthenticated, cocoshanerca.posts.showAllPosts, function(req, res){

});

app.get('/admin/post-edit', ensureAuthenticated, cocoshanerca.posts.showEditProduct, function (req,res, next) {

});

app.get('/admin/all-categories', ensureAuthenticated, cocoshanerca.category.showAllCategories, function (req,res, next) {

});

app.get('/admin/all-blog-posts', ensureAuthenticated, cocoshanerca.blog.showAllBlogPosts, function (req,res, next) {

});

app.get('/admin/add-new-blog-post', ensureAuthenticated, cocoshanerca.blog.addNewBlogPost, function (req,res, next) {

});

app.get('/admin/blog-post-edit', ensureAuthenticated, cocoshanerca.blog.showBlogEditPosts, function (req,res, next) {

});

app.get('/admin/all-users', ensureAuthenticated, cocoshanerca.user.shoWAllAdminUsers, function (req,res, next) {

});



// logout
app.get('/admin/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/admin');
});






function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/admin');
    }
}





// Update product from admin - koristimo upload image na post/index.js i za produkte i za blog
app.post('/post/update', cocoshanerca.posts.upload.single('image'), function (req, res, next) {

    cocoshanerca.posts.updatePost.updateQuery(req, res);
    // console.log('Body', req.body); // contains the text fields
    // console.log('Image', req.file); // contains the text fields
});

//Update blog post from admin
app.post('/blog-post/update', cocoshanerca.posts.upload.single('image'), function (req, res, next) {

    cocoshanerca.blog.updateBlogPost.updateQuery(req, res);
});


app.post('/post/add',cocoshanerca.posts.upload.single('image'), cocoshanerca.posts.createNewPost, function(req, res){


});

app.post('/post/blog-add',cocoshanerca.posts.upload.single('image'), cocoshanerca.blog.createNewBlogPost, function(req, res){


});


app.post('/email', cocoshanerca.posts.sendEmail, function (req, res) {

});

app.use('/', cocoshanerca.router, function (req,res) {

});



app.listen(app.get('port'), () => {
    console.log("APP running on port: ", app.get('port'));
});


