const express = require('express');
const mysql = require("mysql");
const session = require('express-session');
const router = express.Router();

const bodyParser = require('body-parser');

router.use(session({secret:"secret"}));

const request = require('request');

router.use(express.urlencoded({extended:true}));

function isProductInCart(cart,id){
    for(let i=0; i<cart.length; i++){
        if(cart[i].id == id){
            return true;
        }
    }
    return false;
}

function calculateTotal(cart,req){
    total = 0;
    for(let i=0; i<cart.length; i++){
        total = total + (cart[i].price * cart[i].quantity);
    }
    req.session.total = total;
    return total;
}

router.get('/',(req,res) => {
     res.render('index1');
 });

router.get('/index',(req,res) =>{
    res.render('index');
});

router.get('/register',(req,res) =>{
    res.render('register');
});

router.get('/login',(req,res) =>{
    res.render('login');
});

router.get('/sproduct',(req,res) =>{
    res.render('sproduct');
});

router.post('/add_to_cart', function(req,res){
    var id = req.body.id;
    var image = req.body.image;
    var name = req.body.name;
    var price = req.body.price;
    var quantity = req.body.quantity;
    var product = {id:id, name:name, price:price, quantity:quantity, image:image};

    if(req.session && req.session.cart){
        var cart = req.session.cart;

        if(!isProductInCart(cart,id)){
            cart.push(product);
        }
    }else{
        req.session.cart = [product];
        var cart = req.session.cart;
    }

    //calculate total
    calculateTotal(cart,req);

    //return to cart page
    res.redirect('cart');
});

router.get('/cart',function(req,res){
    var cart = req.session.cart;
    var total = req.session.total;

    res.render('cart.ejs',{cart:cart, total:total});
});

router.get('/shop', function(req,res) {   
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"nodejs-login"
    })

    con.query("SELECT * FROM products", (err,result)=>{
        res.render('shop.ejs',{result:result});
    });

});

router.post('/remove_product', function(req,res){

    var id = req.body.id;
    var cart = req.session.cart;

    for(let i=0; i<cart.length; i++){
        if(cart[i].id == id){
            cart.splice(cart.indexOf(i),1);
        }
    }

    //recalculate
    calculateTotal(cart,req);
    res.redirect('/cart');
});

router.post('/edit_product_quantity', function(req,res){
    var id= req.body.id;
    var quantity = req.body.quantity;
    var increase_btn = req.body.increase_product_quantity;
    var decrease_btn = req.body.decrease_product_quantity;

    var cart = req.session.cart;

    if(increase_btn){
        for(let i=0; i<cart.length; i++){
            if(cart[i].id == id){
                if(cart[i].quantity > 1){
                    cart[i].quantity = parseInt(cart[i].quantity)+1;
                }
            }
        }
    }

    if(decrease_btn){
        for(let i=0; i<cart.length; i++){
            if(cart[i].id == id){
                if(cart[i].quantity > 1){
                    cart[i].quantity = parseInt(cart[i].quantity)-1;
                }
            }
        }
    }

    calculateTotal(cart,req);
    res.redirect('/cart');
});

router.get('/about',(req,res) =>{
    res.render('about');
});

router.get('/cart',(req,res) =>{
    res.render('cart.ejs');
});

router.get('/blog',(req,res) =>{
    res.render('blog');
});

router.get('/contact',(req,res) =>{
    res.render('contact');
});

router.get('/payment_page',(req,res) =>{
    res.render('payment_page');
});

router.get('/order_placed',(req,res) =>{
    res.render('order_placed');
});

router.get('/order_placed2',(req,res) =>{
    res.render('order_placed2');
});

module.exports = router;