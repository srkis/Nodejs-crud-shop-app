(function ($) {
    "use strict";

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div data-loader="ball-scale"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 300);
    });


    /*[ Show header dropdown ]
    ===========================================================*/
    $('.js-show-header-dropdown').on('click', function(){
        $(this).parent().find('.header-dropdown')
    });

    var menu = $('.js-show-header-dropdown');
    var sub_menu_is_showed = -1;

    for(var i=0; i<menu.length; i++){
        $(menu[i]).on('click', function(){ 
            
                if(jQuery.inArray( this, menu ) == sub_menu_is_showed){
                    $(this).parent().find('.header-dropdown').toggleClass('show-header-dropdown');
                    sub_menu_is_showed = -1;
                }
                else {
                    for (var i = 0; i < menu.length; i++) {
                        $(menu[i]).parent().find('.header-dropdown').removeClass("show-header-dropdown");
                    }

                    $(this).parent().find('.header-dropdown').toggleClass('show-header-dropdown');
                    sub_menu_is_showed = jQuery.inArray( this, menu );
                }
        });
    }

    $(".js-show-header-dropdown, .header-dropdown").click(function(event){
        event.stopPropagation();
    });

    $(window).on("click", function(){
        for (var i = 0; i < menu.length; i++) {
            $(menu[i]).parent().find('.header-dropdown').removeClass("show-header-dropdown");
        }
        sub_menu_is_showed = -1;
    });


     /*[ Fixed Header ]
    ===========================================================*/
    var posWrapHeader = $('.topbar').height();
    var header = $('.container-menu-header');

    $(window).on('scroll',function(){

        if($(this).scrollTop() >= posWrapHeader) {
            $('.header1').addClass('fixed-header');
            $(header).css('top',-posWrapHeader);

        }  
        else {
            var x = - $(this).scrollTop(); 
            $(header).css('top',x); 
            $('.header1').removeClass('fixed-header');
        } 

        if($(this).scrollTop() >= 200 && $(window).width() > 992) {
            $('.fixed-header2').addClass('show-fixed-header2');
            $('.header2').css('visibility','hidden'); 
            $('.header2').find('.header-dropdown').removeClass("show-header-dropdown");
            
        }  
        else {
            $('.fixed-header2').removeClass('show-fixed-header2');
            $('.header2').css('visibility','visible'); 
            $('.fixed-header2').find('.header-dropdown').removeClass("show-header-dropdown");
        } 

    });
    
    /*[ Show menu mobile ]
    ===========================================================*/
    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.wrap-side-menu').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu');

    for(var i=0; i<arrowMainMenu.length; i++){
        $(arrowMainMenu[i]).on('click', function(){
            $(this).parent().find('.sub-menu').slideToggle();
            $(this).toggleClass('turn-arrow');
        })
    }

    $(window).resize(function(){
        if($(window).width() >= 992){
            if($('.wrap-side-menu').css('display') == 'block'){
                $('.wrap-side-menu').css('display','none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }
            if($('.sub-menu').css('display') == 'block'){
                $('.sub-menu').css('display','none');
                $('.arrow-main-menu').removeClass('turn-arrow');
            }
        }
    });


    /*[ remove top noti ]
    ===========================================================*/
    $('.btn-romove-top-noti').on('click', function(){
        $(this).parent().remove();
    })


    /*[ Block2 button wishlist ]
    ===========================================================*/
    $('.block2-btn-addwishlist').on('click', function(e){
        e.preventDefault();
        $(this).addClass('block2-btn-towishlist');
        $(this).removeClass('block2-btn-addwishlist');
        $(this).off('click');
    });

    /*[ +/- num product ]
    ===========================================================*/
    $('.btn-num-product-down').on('click', function(e){
        e.preventDefault();
        var numProduct = Number($(this).next().val());
        if(numProduct > 1) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function(e){
        e.preventDefault();
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });


    /*[ Show content Product detail ]
    ===========================================================*/
    $('.active-dropdown-content .js-toggle-dropdown-content').toggleClass('show-dropdown-content');
    $('.active-dropdown-content .dropdown-content').slideToggle('fast');

    $('.js-toggle-dropdown-content').on('click', function(){
        $(this).toggleClass('show-dropdown-content');
        $(this).parent().find('.dropdown-content').slideToggle('fast');
    });


    /*[ Play video 01]
    ===========================================================*/
    var srcOld = $('.video-mo-01').children('iframe').attr('src');

    $('[data-target="#modal-video-01"]').on('click',function(){
        $('.video-mo-01').children('iframe')[0].src += "&autoplay=1";

        setTimeout(function(){
            $('.video-mo-01').css('opacity','1');
        },300);      
    });

    $('[data-dismiss="modal"]').on('click',function(){
        $('.video-mo-01').children('iframe')[0].src = srcOld;
        $('.video-mo-01').css('opacity','0');
    });



// https://stackoverflow.com/questions/3138564/looping-through-localstorage-in-html5-and-javascript

// https://www.youtube.com/watch?v=1Q74A6ZQxdY&list=PLoN_ejT35AEhzNoPStBzAkpqAu3YQwPj7

    var cart = [];

    var Item = function (nameProduct, price,count, imgUrl) {
        this.nameProduct = nameProduct;
        this.price = price;
        this.count = count;
        this.imgUrl = imgUrl;
        this.itemTotal = price;  // ovo je za prikazivanje u korpi cene u pocetku ako nema vise itema sa istim imenom. Ako dodamo 2 ili vise itema sa istim imenom, onda prikazujemo price * count i to je itemTotal

    };


    $('.block2-btn-addcart').each(function(){

        var nameProduct = $(this).parent().parent().parent().find('.block2-name').html();
      // var imgUrl = $('.block2-img img').attr('src');
        var imgUrl = $(this).parent().parent().parent().find('.block2-img img').attr('src')
        var price = $(this).parent().parent().parent().find('.block2-price').html();
        //var price = $("#postPrice").val();
        //var nameProduct = $("#postTitle").val();

        nameProduct = nameProduct.trim();
        price = price.trim().substring(0,4);

        $(this).on('click', function(){
            // Ovde ubacujemo u cart

            addItemToCart(nameProduct, price,1,imgUrl);

            function addItemToCart(nameProduct, price, count,imgUrl){
                //Proveravamo da li postoji u localtorage, ako postoji vidimo da li je isti name onda povecavamo count
                var shoppingCart =  JSON.parse(localStorage.getItem("shoppingCart"));

                if(shoppingCart != null && shoppingCart.length > 0) {

                    var item1 = [];
                   // cartCopy.push(itemCopy);

                    for (var j in shoppingCart) {

                        if(shoppingCart[j].nameProduct.trim() === nameProduct.trim()){
                            shoppingCart[j].count += count;
                            //Ako ima vise proizvoda sa istim imenom dodato u korpu onda prikazujemo ovaj total
                            shoppingCart[j].itemTotal = price * shoppingCart[j].count;
                        }

                        item1.push(shoppingCart[j].nameProduct);
                    }

                    if(item1.includes(nameProduct) == false){
                        var item = new Item(nameProduct, price, count, imgUrl);
                        shoppingCart.push(item);
                    }

                   localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

                }else{

                for(var i in cart){


                    // Ako dodamo jos jedan item u korpu sa istim imenom, onda samo uvecamo count za taj item za 1
                    if(cart[i].nameProduct.trim() === nameProduct.trim()){
                        cart[i].count += count;


                    }
                }

                var item = new Item(nameProduct, price, count,imgUrl);
                cart.push(item);

                localStorage.setItem("shoppingCart", JSON.stringify(cart));
                }

                var shoppingCart =  JSON.parse(localStorage.getItem("shoppingCart"));

                showCartItemsOnPage(shoppingCart);
            }


            function showCartItemsOnPage(shoppingCart) {

                if(shoppingCart == null){
                    document.getElementById('cartNum').innerHTML = 0;
                }else{
                    document.getElementById('cartNum').innerHTML = shoppingCart.length;

                    shoppingCart.cartTotal = 0;

                    var wrapper = document.getElementById("header-cart");

                    var myHTML = '';

                    for (var i = 0; i < shoppingCart.length; i++) {

                        myHTML += '<li class="header-cart-item">'+
                            '<div class="header-cart-item-img">'+
                            '<img style="width: 70px; height: 70px;" src= "'+shoppingCart[i].imgUrl+'" alt="IMG">'+
                            '</div>'+

                            '<div class="header-cart-item-txt">'+
                            '<a href="#" class="header-cart-item-name">'+
                            ' '+shoppingCart[i].nameProduct+' '+
                            '</a>'+

                            '<span class="header-cart-item-info">'+shoppingCart[i].price+' x '+shoppingCart[i].count+' = '+shoppingCart[i].itemTotal+'</span>'+
                            '</div>'+
                            '</li>';

                        shoppingCart.cartTotal += Number(shoppingCart[i].itemTotal);

                    }

                    myHTML += '<div class="header-cart-total">'+
                             '<span>Total: '+shoppingCart.cartTotal+'</span>'+
                            '</div>';

                    wrapper.innerHTML = myHTML

                }

            }


            function removeItemFromCart(nameProduct) {   // Removes one item

                for(var i in cart) {
                    if(cart[i].nameProduct === nameProduct){
                        cart[i].count --;   // cart[i].count = cart[i].count -1; - cart[i].count -= 1;
                        if(cart[i].count === 0){
                            cart.splice(i, 1)
                        }
                        break;
                    }
                }

                saveCart();
            }

            function removeItemFromCartAll(nameProduct) {  //Removes all item name

                for (var i in cart){
                    if(cart[i].nameProduct === nameProduct ){
                        cart.splice(i, 1);
                        break;
                    }
                }

                saveCart();
            }


            function clearCart() { // Removes all item from cart

                cart = [];
                saveCart();
            }


            function countCart() {  // -> return total count
                var totalCount = 0;

                for( var i in cart){
                    totalCount += cart[i].count;
                }

                return totalCount;
            }


            function totalCart() { // -> return total cost

                var totalCost = 0;
                for (var i in cart){
                    totalCost += cart[i].price;
                }

                return totalCost;
            }


            function listCart() { //-> array of Items

                var cartCopy = [];
                for(var i in cart){
                    var item = cart[i];
                    var itemCopy = {};
                    for (var p in item) {  // p as property of item object
                        itemCopy[p] = item[p];
                    }

                    cartCopy.push(itemCopy);
                }

                return cartCopy;

            }

            function saveCart(){ // save cart to localstorage

                localStorage.setItem("shoppingCart", JSON.stringify(cart));

            }


            function loadCart() {   //-> load cart if cart saved in localstorage

                cart = JSON.parse(localStorage.getItem("shoppingCart"));

            }

            loadCart();



            swal(nameProduct, "Proizvod je uspešno dodat u korpu", "success");
        });
    });

    $('.block2-btn-addwishlist').each(function(){
        var nameProduct = $(this).parent().parent().parent().find('.block2-name').html();
        $(this).on('click', function(){
            swal(nameProduct, "Proizvod je uspešno dodat u listu želja", "success");
        });
    });




    $("#poruci").click(function(e){
        e.preventDefault();

        var ime = $('#ime').val();
        var telefon = $('#telefon').val();
        var ulica = $('#ulica').val();
        var grad = $('#grad').val();
        var email = $('#email').val();
        var poruka = $('#poruka').val();


        if(ime == '' || telefon == '' || ulica == '' || grad == '' || email == ''){
            $("#formError").fadeIn(2000);return;
        }


       var formData = [{
           ime: ime,
           telefon:telefon,
           ulica:ulica,
           grad:grad,
           email:email,
           poruka:poruka
       }];


        $.ajax({
            type: "POST",
            url: "/email",
            data: { formData: formData, shoppingCart: shoppingCart },
            success: function(data) {
               if(data.success === true){
                   $("#formSuccess").fadeIn(2000);return;
               }
            },
            error: function(jqXHR, textStatus, err) {
                alert('text status '+textStatus+', err '+err)
            }
        });



    });










})(jQuery);