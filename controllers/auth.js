const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require("util");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req,res) => {
    console.log(req.body);

    const{name, username, email, password, passwordConfirm, DOB, address, gender}= req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error,results) => {
        if(error){
            console.log(error);
        }
        if(results.length>0){
            return res.render('register',{
                message:'That email is already in use'
            })
        } else if(password !== passwordConfirm){
            return res.render('register',{
                message:'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, username:username, email: email, password: hashedPassword, DOB:DOB, address:address, gender:gender}, (error, results) => {
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('register',{
                    message: 'User registered'
                })
            }

        })
    });
}

exports.login = (req,res) => {
    console.log(req.body);

    const{name, username, email, password, passwordConfirm, DOB, address, gender}= req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error,results) => {
        if(error){
            console.log(error);
        }
        if(results.length>0){
            return res.render('login',{
                message:'That email is already in use'
            })
        } else if(password !== passwordConfirm){
            return res.render('login',{
                message:'User logged in'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, username:username, email: email, password: hashedPassword, DOB:DOB, address:address, gender:gender}, (error, results) => {
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('register',{
                    message: 'User registered'
                })
            }

        })
    });
}

