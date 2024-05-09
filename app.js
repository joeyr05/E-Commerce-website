const express = require('express');
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');

const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');

dotenv.config({path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','hbs');

app.engine('ejs', require('ejs').__express);

db.connect((error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("MYSQL connected")
    }
})

//Route defining
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use("/img", express.static(path.join(__dirname, "./public/img")));

app.listen(5000,() => {
    console.log("Server started onport 5000");
})