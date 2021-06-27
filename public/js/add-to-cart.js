
var cart = [];

var Item = function (name, price,count) {
    this.name = name;
    this.price = price;
    this.count = count;

};


function addItemToCart(name, price, count){

    for(var i in cart){

        // Ako dodamo jos jedan item u korpu sa istim imenom, onda samo uvecamo count za taj item za 1
        if(cart[i].name === name){
            cart[i].count += count;
            return;
        }
    }

    var item = new Item(name, price, count);
    cart.push(item);
    saveCart();
}

function removeItemFromCart(name) {   // Removes one item

    for(var i in cart) {
        if(cart[i].name === name){
            cart[i].count --;   // cart[i].count = cart[i].count -1; - cart[i].count -= 1;
            if(cart[i].count === 0){
                cart.splice(i, 1)
            }
            break;
        }
    }

    saveCart();
}

function removeItemFromCartAll(name) {  //Removes all item name

    for (var i in cart){
        if(cart[i].name === name ){
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