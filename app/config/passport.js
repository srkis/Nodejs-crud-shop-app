const bcrypt = require('bcryptjs');
let LocalStrategy = require('passport-local').Strategy;

const db = require('../db');


module.exports = function (passport) {

    passport.use(new LocalStrategy(function (username, password, done) {

        let query = {email:username};
        db.adminUsersModel.find(query, function (err, user) {

            if(err) throw err;

            if(!user){
                console.log(err);
                return done(null,false,{message:'No user found!'});
            }

            // Match password
            bcrypt.compare(password,user[0].password, function (err, isMatch) { 
                if(err) throw err;
                if(isMatch){
                    return done(null, user);

                }else {
                    return done(null,false,{message:'Wrong password'});
                }
            });
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user[0].id)
    });

    passport.deserializeUser(function (id, done) {

        db.adminUsersModel.findById(id, function (err, user) {
            done(err,user);
        });
    });


};
