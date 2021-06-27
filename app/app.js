'use strict';

//Social Authentication logic

//require('./auth')();


module.exports = {
    router: require('./routes')(),
   // session: require('./session'),
    posts:require('./posts'),
    category:require('./categories'),
    blog: require('./blog'),
    user: require('./users'),

}