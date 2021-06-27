'use strict';

const db = require('../db');

let showAllCategories = (req, res, next) => {

    // Selektujemo sve kategorije
    db.catModel.find({}, function(err, data){
        res.render('admin/all-categories', {
            'data': data,
            'title': 'Cocoshanerca | All Categories'
        });


    });
};


let showEditCategory = (req,res,next) => {

    let catId = req.query.id;

            db.catModel.findById(catId ,function(err, category) {

                res.render('admin/cat-edit', {
                    'pageTitle': 'Cocoshanerca | Edit Category',
                    'data': category
                });

            });
        };



let updateCategory = {
    updateQuery: (req, res, next) => {

        let catId = req.body.catId;

        var newvalues = {$set: {name:req.body.catName} };

        var myquery = {_id: catId};

        db.catModel.updateOne(myquery, newvalues, function(err, result) {
            if ( err ) throw err;

            console.log(result.nModified);
            res.redirect('/admin/all-categories');
        });
    }
};




module.exports = {

    showAllCategories,
    showEditCategory,
    updateCategory

};
