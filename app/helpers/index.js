'use strict';
const router = require('express').Router();
const db = require('../db');

let _registerRoutes = (routes, method) => {
    for (let key in routes) {
        if (typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
            _registerRoutes(routes[key], key);
        } else {
            //Register the routes
            if (method === 'get') {
                router.get(key, routes[key]);
            } else if (method === 'post') {
                router.post(key, routes[key]);
            }else{
                router.use(routes[key]);
            }
        }
    }
}

let route  = routes => {
    _registerRoutes(routes);
    return router;
}

// Find a single user based on a key
let findOne = profileID => {
    return db.userModel.findOne({
        'profileId': profileID
    });
}

//Create new user and return that instance
let createNewUser = profile => {
    return new Promise((resolve, reject) => {
        let newcocoUser = new db.userModel({
            profileId: profile.id,
            fullName:profile.displayName,
            profilePic: profile.photos[0].value || ''
        });

        newcocoUser.save(error => {
            if(error){
            reject(error);
              }else{
                resolve(newcocoUser);
               }
            });
       });
}


//The ES6 promisified version of findById
let findById = id => {
    return new Promise((resolve, reject) => {
       db.userModel.findById(id,(error,user) => {
           if(error){
               reject(error);
           }else{
               resolve(user);
           }
       });
    });
}




module.exports = {

    route:route,
    findOne,
    createNewUser,
    findById
}