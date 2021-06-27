$(document).ready(function() {


    var userFeed = new Instafeed({
        get: 'user',
        userId: '5950670521',
        limit: 5,
        resolution: 'standard_resolution',
        accessToken: 'YOUR ACCESS ID',
        sortBy: 'most-recent',
        template: '<div class=" block4 wrap-pic-w col-lg-3 instaimg"><a href="{{image}}" title="{{caption}}" target="_blank"><img src="{{image}}" alt="{{caption}}" class="img-fluid"/></a></div>',
    });


    userFeed.run();


    // This will create a single gallery from all elements that have class "gallery-item"
    $('.gallery').magnificPopup({
        type: 'image',
        delegate: 'a',
        gallery: {
            enabled: true
        }
    });


});

