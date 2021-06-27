'use strict';
const config = require('../config');
//const Mongoose = require('mongoose').connect(config.dbURI,
//{ useNewUrlParser: true })

const Mongoose = require('mongoose');

Mongoose.connect("mongodb+srv://test@cluster0.dj8x9.mongodb.net/database?retryWrites=true&w=majority", { useNewUrlParser: true });

var conn = Mongoose.connection;

// Log an error if the connect fails
conn.on('error', error => {
    if(error){

    }
    console.log("MongoDB error: ", error);
});


//Create a Schema that defines the structure for storin user data
// Ovo je za social network login

const cocoUser = new Mongoose.Schema({
        profileId: String,
        fullName: String,
        profilePic: String,
        email:String
});


/*
const adminCategories = new Mongoose.Schema({
    catId: String,
    name: String,
});
*/



 let post = new Mongoose.Schema({
   catId: String,
   catName: String,
   postTitle: String,
   postContent: String,
   postPic: String,
   postPrice: String,
   type: String,
   createdAt: {type: Date, default: Date.now}

});

//Turn the schema into a usable model

let userModel = Mongoose.model('cocoUser', cocoUser);
let postModel = Mongoose.model('post', post);
//let catModel = Mongoose.model('categories', adminCategories);

let catModel = Mongoose.model('Cats', new Mongoose.Schema({ catId: String, name: String}, { collection : 'categories' }));   // collection name;

let blogModel = Mongoose.model('Blog', new Mongoose.Schema({
    blogTitle: String,
    blogContent: String,
    blogPic:String,
    author:String,
    createdAt: {type: String, default: formatDate(new Date())}
    },
    { collection : 'blog' }

    ));


let adminUsersModel = Mongoose.model('adminUsers', new Mongoose.Schema({
        first_name: String,
        last_name: String,
        email:String,
        password:String,
        password2:String,
    },
    { collection : 'adminUsers' }

));



function formatDate(date) {
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "Maj", "Jun", "Juj",
        "Aug", "Sep", "Okt",
        "Nov", "Dec"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] ;
}



module.exports = {
    conn,
    userModel,
    postModel,
    catModel,
    blogModel,
    adminUsersModel

};