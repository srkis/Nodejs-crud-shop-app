'use strict';
var express = require('express');
var route = express.Router();
const multer = require('multer');

const db = require('../db');
const config = require('../config');
const h = require('../helpers');
let fs = require('fs');
let pathModule = require('path');
const nodemailer = require('nodemailer');


// Render add-new-post admin page - On routes we call this function, select from db to get all cats, show on admin page

let addNewPost = (req, res,next) => {
        db.catModel.find({},function(err, results) {

    res.render('admin/add-new-post', {
        'title': 'Cocoshanerca | Add new post',
        'data': results
    });
        });

};

let showAllPosts = (req, res, next) => {

    // Selektujemo sve postove db.collection.find().sort( { age: -1 } )
    db.postModel.find({}, function(err, data){
        res.render('admin/all-posts', {
            'data': data,
            'title': 'Cocoshanerca | Add new post'
        });
    }).sort( { createdAt: -1 } );
}


let showAkcijeIRasprodaja = (req, res,next) => {
    //Ovde dobijamo za tu kategoriju _id i name, zato sto nam treba _id da bismo dobili sve postove iz te kategorije
    db.catModel.find({name: "Akcije i rasprodaja"}, function(err, result){
        let catId = result[0]._id;

        // Selektujemo sve postove sa ovim catId-jem i prosledjujemo na view data array of objects
        db.postModel.find({catId: catId}, function(err, data){
            res.render('category/akcije-i-rasprodaja',{
                pageTitle:"Cocoshanerca | Akcije & Rasprodaja",
                'data': data
            });

        });
    });

};

let showNarukvice = (req, res,next) => {
   
    db.catModel.find({name: "Narukvice"}, function(err, result){
    let catId = result[0]._id;

   
    db.postModel.find({catId: catId}, function(err, data){

        res.render('category/narukvice', {
            'pageTitle': 'Cocoshanerca | Narukvice',
            'data': data
       });
    });
 });

};

let showSaloviIesarpe = (req, res,next) => {
  
    db.catModel.find({name: "Salovi i esarpe"}, function(err, result){
        let catId = result[0]._id;

       
        db.postModel.find({catId: catId}, function(err, data){

            res.render('category/salovi-i-esarpe', {
                'pageTitle': 'Cocoshanerca | Salovi i esarpe',
                'data': data
            });
        });
    });

};

let showDreamcatcher = (req, res,next) => {
   
    db.catModel.find({name: "Dreamcatcher"}, function(err, result){
        let catId = result[0]._id;

   
        db.postModel.find({catId: catId}, function(err, data){

            res.render('category/dreamcatcher', {
                'pageTitle': 'Cocoshanerca | Dreamcatcher',
                'data': data
            });
        });
    });

};


let showMindjujse = (req, res,next) => {
    db.catModel.find({name: "Mindjuse"}, function(err, result){
        let catId = result[0]._id;

        
        db.postModel.find({catId: catId}, function(err, data){

            res.render('category/mindjuse', {
                'pageTitle': 'Cocoshanerca | Mindjuse',
                'data': data
            });
        });
    });

};


let showOgrlice = (req, res,next) => {
    db.catModel.find({name: "Ogrlice"}, function(err, result){
        let catId = result[0]._id;

        db.postModel.find({catId: catId}, function(err, data){

            res.render('category/ogrlice', {
                'pageTitle': 'Cocoshanerca | Ogrlice',
                'data': data
            });
        });
    });

};


let showProductDetail = (req,res,next) => {

    let productId = req.query.id;

    let product = db.postModel.findById(productId, function(err, product){

        res.render('category/product-detail', {
            'pageTitle': 'Cocoshanerca | Product Detail',
            'data': product
        });

    });

};

let showEditProduct = (req,res,next) => {

    let productId = req.query.id;
    let product = db.postModel.findById(productId, function(err, product){

        db.catModel.findById(product.catId, function(err, result){
           let catName = result.name;

           product.catName = catName;

        db.catModel.find({},function(err, categories) {

        res.render('admin/post-edit', {
            'pageTitle': 'Cocoshanerca | Edit Product',
            'data': product,
            'categories': categories
          });

         });

       });

    });

};

let createNewPost = (req,res) => {

    //U ovom slucaju req.body.category je category ID nije ime kategorije jer sa forme sa admina imam u option/select value gde je catId

    let category = db.catModel.findById(req.body.category, function(err, result){

   return new Promise((resolve, reject) => {
        let newAdminPost = new db.postModel({
            catId: result._id,
            name:req.body.category,
            postTitle: req.body.title,
            postContent: req.body.content,
            postPic: req.file.filename,
            postPrice: req.body.price,
            type: req.body.type,
        });

        newAdminPost.save(error => {
            if(error){
                reject(error);
            }else{
                resolve(newAdminPost);
                res.redirect('/admin/all-posts')
            }
          });
     });

    });
};

// Ovde uploadujemo sliku u uploads foldes, na server.js page zovemo na ruti upload i addNew, a u app.js ucitavamo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'));
    }

        cb(null, './public/uploads/')
    },
    filename: function (req, file,cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },

});

const upload = multer({
    storage: storage
});



//Ovo je primer kako da napravimo custom middleware koji zovemo u server.js na ovaj nacin

 //  app.get('/', [middleware.requireAuthentication, middleware.logger], function(req, res) {
     //   res.send('Hello!');
  //  });

/*var middleware = {
    requireAuthentication: function(req, res, next) {
        console.log('First!');
        next();
    },
    logger: function(req, res, next) {
        console.log('Original request hit : '+req.originalUrl);
        next();
    }
};*/



let updatePost = {
    updateQuery: (req, res, next) => {

        let productId = req.body.prodId;

        let catId = req.body.category; // categoryId

        // Ako nema slike
        if (typeof req.file === 'undefined'){
            var newvalues = {$set: {postTitle:req.body.title,postContent:req.body.content,postPrice:req.body.price} };
        }else{
            var newvalues = {$set: {postTitle:req.body.title,postContent:req.body.content,postPrice:req.body.price, postPic:req.file.filename} };
        }

        var myquery = {_id: productId};
       // var newvalues = {$set: {postTitle:req.body.title,postContent:req.body.content,postPrice:req.body.price, postPic:imageName} };

        db.postModel.updateOne(myquery, newvalues, function(err, result) {
            if ( err ) throw err;

            console.log(result.nModified);
            res.redirect('/admin/all-posts');
        });

        //next();
    }
};

let deletePost = (req,res,next) => {

    let productId = req.query.id;

    var myquery = {_id: productId };
    db.postModel.remove(myquery, function(err, obj) {
        if (err) throw err;
        console.log(obj)
        res.redirect('/admin/all-posts');
    });

};

/*const storageUpdate = multer.diskStorage({
    destination: function (req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }

        cb(null, './public/uploads/')
    },
    filename: function (req, file,cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },

});

const updateImage = multer({
    storage: storageUpdate
});*/


let showRandomPosts = (req, res) => {

    db.postModel.aggregate( [ { $sample: {size: 8} } ] , function(err, data){

       db.blogModel.find({}, function(err, blog){

        res.render('index.ejs',{
                pageTitle: "Cocoshanerca | Home ",
                data:data,
                blog:blog
             });
    }).sort( { createdAt: -1 } ).limit(3);

    });
};



let addNewCategory = (req,res) => {

    console.log(req.body);

    // Selektujemo sve kategorije
    let categories = db.catModel.find({}, function(err, data){

    });
};


let sendEmail = (req,res) => {


    const output = `


<body link="#00a5b5" vlink="#00a5b5" alink="#00a5b5">

        <table class=" main contenttable" align="center" style="font-weight: normal;border-collapse: collapse;border: 0;margin-left: auto;margin-right: auto;padding: 0;font-family: Arial, sans-serif;color: #555559;background-color: white;font-size: 16px;line-height: 26px;width: 600px;">
        <tr>
        <td class="border" style="border-collapse: collapse;border: 1px solid #eeeff0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;">
        <table style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
        <tr>
        <td colspan="4" valign="top" class="image-section" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;background-color: #fff;border-bottom: 4px solid #00a5b5">
        <a href="https://tenable.com"><img class="top-image" src="https://info.tenable.com/rs/tenable/images/tenable-white-email.png" style="line-height: 1;width: 600px;" alt="Tenable Network Security"></a>
        </td>
        </tr>
        <tr>
        <td valign="top" class="side title" style="border-collapse: collapse;border: 0;margin: 0;padding: 20px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;vertical-align: top;background-color: white;border-top: none;">
        <table style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
        <tr>
        <td class="head-title" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 28px;line-height: 34px;font-weight: bold; text-align: center;">
        <div class="mktEditable" id="main_title">
        Title of Email is super long and detailed
    </div>
    </td>
    </tr>
    <tr>
    <td class="sub-title" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;padding-top:5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 18px;line-height: 29px;font-weight: bold;text-align: center;">
        <div class="mktEditable" id="intro_title">
        Sub title:
        </div></td>
    </tr>
    <tr>
    <td class="top-padding" style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"></td>
        </tr>
        <tr>
        <td class="grey-block" style="border-collapse: collapse;border: 0;margin: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;background-color: #fff; text-align:center;">
        <div class="mktEditable" id="cta">
        <img class="top-image" src="https://info.tenable.com/rs/tenable/images/webinar-no-text.png" width="560"/><br><br>
        <strong>Date:</strong> Caecuss, Dabico xx, XXXX<br>
    <strong>Time</strong>: 9:00 am &#8211; 4:00 pm<br><br>
    <a style="color:#ffffff; background-color: #ff8300;  border: 10px solid #ff8300; border-radius: 3px; text-decoration:none;" href="#">Download Now</a>
    </div>
    </td>
    </tr>
    <tr>
    <td class="top-padding" style="border-collapse: collapse;border: 0;margin: 0;padding: 15px 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 21px;">
        <hr size="1" color="#eeeff0">
        </td>
        </tr>
        <tr>
        <td class="text" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;">
        <div class="mktEditable" id="main_text">
        Hello First Name:,<br><br>

    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br><br>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
    </td>
    </tr>
    <tr>
    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;">
        &nbsp;<br>
    </td>
    </tr>
    <tr>
    <td class="text" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;">
        <div class="mktEditable" id="download_button" style="text-align: center;">
        <a style="color:#ffffff; background-color: #ff8300; border: 20px solid #ff8300; border-left: 20px solid #ff8300; border-right: 20px solid #ff8300; border-top: 10px solid #ff8300; border-bottom: 10px solid #ff8300;border-radius: 3px; text-decoration:none;" href="#">Download Now</a>                                       
    </div>
    </td>
    </tr>

    </table>
    </td>
    </tr>
    <tr>
    <td style="padding:20px; font-family: Arial, sans-serif; -webkit-text-size-adjust: none;" align="center">
        <table>
        <tr>
        <td align="center" style="font-family: Arial, sans-serif; -webkit-text-size-adjust: none; font-size: 16px;">
        <a style="color: #00a5b5;" href="{{system.forwardToFriendLink}}">Forward this Email</a>
    <br/><span style="font-size:10px; font-family: Arial, sans-serif; -webkit-text-size-adjust: none;" >Please only forward this email to colleagues or contacts who will be interested in receiving this email.</span>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px; padding: 20px;">
        <div class="mktEditable" id="cta_try">
        <table border="0" cellpadding="0" cellspacing="0" class="mobile" style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
        <tr>
        <td class="force-col" valign="top" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;">

        <table class="mb mt" style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;margin-bottom: 15px;margin-top: 0;">
        <tr>
        <td class="grey-block" style="border-collapse: collapse;border: 0;margin: 0;padding: 18px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;background-color: #fff; border-top: 3px solid #00a5b5; border-left: 1px solid #E6E6E6; border-right: 1px solid #E6E6E6; border-bottom: 1px solid #E6E6E6; width: 250px; text-align: center;">

        <span style="font-family: Arial, sans-serif; font-size: 24px; line-height: 39px; border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559; text-align: center;font-weight: bold;">Try Our Products</span><br>
    Get started with a trial for your organization<br><br>
    <a style="color:#ffffff; background-color: #00a5b5;  border-top: 10px solid #00a5b5; border-bottom: 10px solid #00a5b5; border-left: 20px solid #00a5b5; border-right: 20px solid #00a5b5; border-radius: 3px; text-decoration:none;" href="https://www.tenable.com/evaluate">Try Now</a>

    </td>
    </tr>
    </table>
    </td>   
    <td class="rm-col" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;padding-right: 15px;"></td>
        <td class="force-col" valign="top" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;">
        <table class="mb mt" style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;margin-bottom: 15px;margin-top: 0;">
        <tr>
        <td class="grey-block" style="border-collapse: collapse;border: 0;margin: 0;padding: 18px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 24px;background-color: #fff; border-top: 3px solid #00a5b5; border-left: 1px solid #E6E6E6; border-right: 1px solid #E6E6E6; border-bottom: 1px solid #E6E6E6; width: 250px; text-align: center;">

        <span style="font-family: Arial, sans-serif; font-size: 24px; line-height: 39px; border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559; text-align: center;font-weight: bold;">Buy Our Products</span><br>
    Get the full power of Tenable working for you<br><br>
       <a style="color:#ffffff; background-color: #00a5b5;  border-top: 10px solid #00a5b5; border-bottom: 10px solid #00a5b5; border-left: 20px solid #00a5b5; border-right: 20px solid #00a5b5; border-radius: 3px; text-decoration:none;" href="https://www.tenable.com/products/buy">Buy Now</a>

    </td>
    </tr>
    </table>
    </td>   
    </tr>
    </table>
    </div>
    </td>
    </tr>                                           
    <tr>
    <td valign="top" align="center" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;">
        <table style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
        <tr>
        <td align="center" valign="middle" class="social" style="border-collapse: collapse;border: 0;margin: 0;padding: 10px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;text-align: center;">
        <table style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
        <tr>
        <td style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"><a href="https://www.tenable.com/blog"><img src="https://info.tenable.com/rs/tenable/images/rss-teal.png"></a></td>
    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"><a href="https://twitter.com/tenablesecurity"><img src="https://info.tenable.com/rs/tenable/images/twitter-teal.png"></a></td>
    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"><a href="https://www.facebook.com/Tenable.Inc"><img src="https://info.tenable.com/rs/tenable/images/facebook-teal.png"></a></td>
    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"><a href="https://www.youtube.com/tenablesecurity"><img src="https://info.tenable.com/rs/tenable/images/youtube-teal.png"></a></td>
    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"><a href="https://www.linkedin.com/company/tenable-network-security"><img src="https://info.tenable.com/rs/tenable/images/linkedin-teal.png"></a></td>
    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 5px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;"><a href="https://plus.google.com/107158297098429070217"><img src="https://info.tenable.com/rs/tenable/images/google-teal.png"></a></td>

    </tr>
    </table>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr bgcolor="#fff" style="border-top: 4px solid #00a5b5;">
        <td valign="top" class="footer" style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;background: #fff;text-align: center;">
        <table style="font-weight: normal;border-collapse: collapse;border: 0;margin: 0;padding: 0;font-family: Arial, sans-serif;">
        <tr>
        <td class="inside-footer" align="center" valign="middle" style="border-collapse: collapse;border: 0;margin: 0;padding: 20px;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 12px;line-height: 16px;vertical-align: middle;text-align: center;width: 580px;">
        <div id="address" class="mktEditable">
        <b>Cocoshanerca Accessories</b><br>
    Beogradska <br>  broj BB <br> Srbija, 11000 Beograd<br>
    <a style="color: #00a5b5;" href="https://www.tenable.com/contact-tenable">Contact Us</a>
    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>`;



    nodemailer.createTestAccount((err, account) => {

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'srkixxxbgd@gmail.com',
                pass: 'matoraxxxbgd123'
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Cocoshanerca Team👻" <stojanovicsrdjan27@gmail.com>', // sender address
            to: req.body.formData[0].email, // list of receivers
            subject: 'Cocoshanerca accessories', // Subject line
            text: 'Hello world?', // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            res.json({ success: true });
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        });
    });


};


module.exports = {
    addNewPost,
    createNewPost,
    upload,
    showNarukvice,
    showProductDetail,
    showAllPosts,
    showMindjujse,
    showSaloviIesarpe,
    showDreamcatcher,
    showEditProduct,
    addNewCategory,
    updatePost,
    showOgrlice,
    deletePost,
    showRandomPosts,
    showAkcijeIRasprodaja,
    sendEmail

};

