'use strict';
const db = require('../db');
const bcrypt = require('bcryptjs');

const passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

    //Ovo je za dodavanje novog usera sa admina
    let addNewUser = (req, res) => {


      let ime = req.body.ime;
      let prezime = req.body.prezime;
      let email = req.body.email;
      let gender = req.body.gender;
      let password = req.body.password;
      let password2 = req.body.password2;

      req.checkBody('ime', 'Ime je obavezno polje!').notEmpty();
      req.checkBody('prezime', 'Prezime je obavezno polje!').notEmpty();
      req.checkBody('email', 'Email je obavezno polje!').isEmail();
      req.checkBody('password', 'Šifra je obavezno polje!').notEmpty();
      req.checkBody('password2', 'Šifra i ponovljena šifra nisu iste!').equals(req.body.password);

      let errors = req.validationErrors();

      if(errors){
          res.render('admin/add-new-user', {
              title: "Cocoshanerca | Add new user",
              errors: errors

          });

      }else{

          let newUser = db.adminUsersModel({

              first_name: ime,
              last_name: prezime,
              email:email,
              password:password,
          });

          bcrypt.genSalt(10, function (err, salt) {
              bcrypt.hash(newUser.password, salt, function (err,hash) {
                  if(err){
                      console.log(err);
                  }
                  newUser.password = hash;
                  newUser.save(function (err) {
                      if(err){
                          console.log(err);
                          return;
                      }else{
                          req.flash('success', 'New user successfullty registered');
                          res.redirect('/admin/add-new-user');
                      }
                  });
              });
          })
      }

    };


let showAddNewUser = (req, res,next) => {
        res.render('admin/add-new-user', ensureAuthenticated(req,res,next), {
            'title': 'Cocoshanerca | Add new user',
        });
};


// Ovde proveravmo logovanje admin i na passport.js fajlu u config folder, poziva se na server.js /admin/dashboard ruti passport.authenticate('local')
// i require('./app/config/passport.js')(passport);

let loginAdminUser = (req, res,next) => {

    console.log("Checking login...");
    passport.authenticate('local',{
        successRedirect:'/admin/dashboard',
        failureRedirect:'/admin',
        failureFlash:true
    })(req,res,next);

    console.log("Logged in");

};


let shoWAllAdminUsers = (req,res,next) => {

        // Selektujemo sve admin usere
        db.adminUsersModel.find({}, function(err, data){
            res.render('admin/all-users', {
                'data': data,
                'title': 'Cocoshanerca | All Users'
            });
        });
};



module.exports = {

    addNewUser,
    showAddNewUser,
    loginAdminUser,
    shoWAllAdminUsers

};
