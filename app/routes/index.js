'use strict';

const helper = require('../helpers');
const passport = require('passport');
const posts = require('../posts');
const categories = require('../categories');
const blog = require('../blog');
const user = require('../users');

module.exports = () => {

    let routes = {
        'get': {
            '/': (req, res, next) => {
              //  res.render('index',{
               //     pageTitle: "Cocoshanerca | Home "
               // });
                // Prikazujemo 8 random produkta iz baze na indeksu  i 3 blog posta na indeksu - "Novosti sa bloga"
                posts.showRandomPosts(req, res, next);


            },
            '/about': (req, res, next) => {
                res.render('about',{
                    pageTitle:"Cocoshanerca | About Me"
                });
            },
            '/cart': (req, res, next) => {
                res.render('cart',{
                    pageTitle: "Cocoshanerca | My Cart"
                });
            },
            '/product': (req, res, next) => {
                res.render('product',{
                    pageTitle:"Cocoshanerca | Products"
                });
            },
            '/category/akcije-i-rasprodaja': (req, res, next) => {
                posts.showAkcijeIRasprodaja(req, res, next);

            },
            '/contact': (req, res, next) => {
                res.render('contact', {
                    pageTitle:"Cocoshanerca | Contact"
            });
            },
            '/product-detail': (res, req, next) => {
                res.render('product-detail', {
                    pageTitle:"Cocoshanerca | Product Detail"
                });
            },
            '/blog': (req, res, next) => {
                blog.showBlogPostsOnPage(req,res,next);
            },
            '/blog-detail': (req, res, next) => {
                blog.showBlogPostDetail(req,res, next);
            },
            '/login': (req, res, next) => {
                res.render('login');
            },
            '/signup': (req, res, next) => {
                res.render('signup');
            },
            '/category/mindjuse': (req, res, next) => {
                posts.showMindjujse(req, res, next);
            },
            '/category/narukvice': (req, res, next) => {
                posts.showNarukvice(req,res,next);
            },
            '/category/ogrlice': (req, res, next) => {
                posts.showOgrlice(req, res, next);
            },
            '/category/dreamcatcher': (req, res, next) => {
                posts.showDreamcatcher(req, res, next);
            },
            '/category/salovi-i-esarpe': (req, res, next) => {
                posts.showSaloviIesarpe(req,res,next);
            },
            '/category/product-detail': (req, res, next) => {
                posts.showProductDetail(req,res,next);
            },

            '/admin': (req, res, next) => {
                res.render('admin/login')
            },
            '/auth/facebook': passport.authenticate('facebook'),
            '/auth/facebook/callback': passport.authenticate('facebook',{
                successRedirect:'/',
                failureRedirect: '/'
            }),
          
            '/admin/post-delete': (req, res, next) => {
            
                posts.deletePost(req, res, next);
            },
            '/admin/cat-edit': (req, res, next) => {
             
                categories.showEditCategory(req, res, next);
            },
          
            '/admin/blog-post-delete': (req, res, next) => {
                res.status(404).sendFile(process.cwd() + '/views/404/404.html');
                
            },
         

        },
        'post': {
        
        },
        'NA':(req, res, next) => {
            res.status(404).sendFile(process.cwd() + '/views/404/404.html');
        }
    }

  return helper.route(routes);

}
