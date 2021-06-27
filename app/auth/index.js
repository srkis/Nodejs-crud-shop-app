'use strict';
const passport = require('passport');
const config = require('../config');
const h = require('../helpers');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // Find the user using _id
        h.findById(id)
            .then(user => done(null, user))
            .catch(error => console.log('Error when deserializing the user'));
    });

    let authProcessor = (accessToken, refreshToken,profile, done) => {

        //Find user in local db usid profile.id
        //If the user is found, return the user data from database the done()
        //If the user is not found, create one in the local db and return
        h.findOne(profile.id)
            .then(result => {
                if(result){
                    done(null,result);
                }else{
                    // Create a new user and return! CHECK IF WE NEED THIS IS COCOSHANERCA
                    h.createNewUser(profile)
                        .then(newCocouser => done(null, newCocouser))
                        .catch(error => console.log('Error when creating new user'));
                }
            })
    }

    passport.use(new FacebookStrategy(config.fb, authProcessor ));

}
