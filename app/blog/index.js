'use strict';

const db = require('../db');

const multer = require('multer');



//Ovo je kada se ucitava stranica za dodavanje novog blog posta,a create je kada kliknemo na button pa pokupimo iz forme sve..itd
let addNewBlogPost = (req, res,next) => {
    db.catModel.find({},function(err, results) {

        res.render('admin/add-new-blog-post', {
            'title': 'Cocoshanerca | Add new blog post',
            'data': results
        });
    });

};

let createNewBlogPost = (req,res) => {

        return new Promise((resolve, reject) => {
            let newAdminBlogPost = new db.blogModel({

                blogTitle: req.body.title,
                blogContent: req.body.content,
                blogPic: req.file.filename,
                author: req.body.author,
            });

            newAdminBlogPost.save(error => {
                if(error){
                    reject(error);
                }else{
                    resolve(newAdminBlogPost);
                    res.redirect('/admin/all-blog-posts')
                }
            });
        });

};

//Ovo je na adminu
let showAllBlogPosts = (req, res, next) => {

    // Selektujemo sve postove db.collection.find().sort( { age: -1 } )
    db.blogModel.find({}, function(err, data){
        res.render('admin/all-blog-posts', {
            'data': data,
            'title':'Cocoshanerca | All Blog Posts'
        });
    }).sort( { createdAt: -1 } );
};


//Ovo je za usere
let showBlogPostsOnPage = (req, res, next) => {

    // Selektujemo sve postove db.collection.find().sort( { age: -1 } )
    db.blogModel.find({}, function(err, data){

        res.render('blog', {
            'pageTitle': 'Cocoshanerca | Blog ',
            'data': data
        });
    }).sort( { createdAt: -1 } );
};


let showBlogEditPosts = (req,res,next) => {

    let blogPostId = req.query.id;

    let product = db.blogModel.findById(blogPostId, function(err, data){

            res.render('admin/blog-post-edit', {
                'pageTitle': 'Cocoshanerca | Edit Blog posts',
                'data': data,

            });
     });
};


let updateBlogPost = {
    updateQuery: (req, res, next) => {

        let blogId = req.body.blogId;

        // Ako nema slike
        if (typeof req.file === 'undefined'){
            var newvalues = {$set: {blogTitle:req.body.title,blogContent:req.body.content,author:req.body.author} };
        }else{
            var newvalues = {$set: {blogTitle:req.body.title,blogContent:req.body.content,author:req.body.author, blogPic:req.file.filename} };
        }

        var myquery = {_id: blogId};
        // var newvalues = {$set: {postTitle:req.body.title,postContent:req.body.content,postPrice:req.body.price, postPic:imageName} };

        db.blogModel.updateOne(myquery, newvalues, function(err, result) {
            if ( err ) throw err;

            console.log(result.nModified);
            res.redirect('/admin/all-blog-posts');
        });
    }
};


let deleteBlogPost = (req,res,next) => {

    let blogId = req.query.id;

    var myquery = {_id: blogId };
    db.blogModel.deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        res.redirect('/admin/all-blog-posts');
    });

};

let showBlogPostDetail = (req,res,next) => {

    let blogId = req.query.id;

    db.blogModel.findById(blogId, function(err, data){

        db.catModel.find({},function(err, categories) {

            db.blogModel.find({}, function(err, featured){

        res.render('blog-detail', {
            'pageTitle': 'Cocoshanerca | Blog post Detail',
            'data': data,
            'categories': categories,
            'featured':featured

           });

            }).sort( { createdAt: -1 } ).limit(5);
        });
    });

};







module.exports = {
    createNewBlogPost,
    showAllBlogPosts,
    addNewBlogPost,
    showBlogPostsOnPage,
    showBlogEditPosts,
    updateBlogPost,
    deleteBlogPost,
    showBlogPostDetail,

}