'use strict';

var Promise = global.Promise || require('promise');

var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')
var db = require('./lib/db');
var requestData = {}
var app = express();

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: 'main',

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'views/partials/'
    ]
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('login', {
        title: 'Login'
    });
});
app.get('/main', function (req, res) {
	if(req.query.username){
	    res.render('main', {
	        title: 'Main',
	        username: req.query.username
	    });
    }
    else{
    	res.redirect('http://localhost:3000/login');
    }
});

app.get('/login', function (req, res) {
    res.render('login', {
        title  : 'Login',
    });
});

app.get('/register', function (req, res) {
    res.render('home', {
        title: 'Register'
    });
});

app.post('/register',function(req,res){
    requestData = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        confirm: req.body.confirm
    };
    var available = false;
    db.query('SELECT * FROM userdetails', function(err, rows, fields) {
        if (err) throw err;
        var id = rows.length;
        
        for (var i in rows) {
            if(rows[i].email == requestData.email || rows[i].username == requestData.username){
                available = true;
                break;
            }
        }
        if(!available){
            id++;
            db.query('INSERT INTO userdetails(userid,username, email, password) VALUES ("' + id + '","' + requestData.username + '","'+ requestData.email + '","' + requestData.password + '")', function(err, rows, fields) {
                if(!err){
                    res.json({status: "success"})
                }
                else{
                    res.json({status: "error"})
                }
            });    
        }
        else{
            if(req.body.name == '' ||  req.body.username == '' || req.body.password == '' || req.body.confirm == '' || req.body.email == ''){
                res.json({status: "empty"})
            }
            else{
    		  res.json({status: "Email or Username is already registered"});
    	    }
        }
    });
});

app.post('/login',function(req,res){
    requestData = {
        username: req.body.username,
        password: req.body.password,
    };
    if(requestData.username == '' || requestData.password == ''){
        res.json({status: "Please enter the Username & Password"});
    }
    else{
        db.query('SELECT * FROM userdetails WHERE username = "'+ requestData.username + '" and password = "' + requestData.password + '"', function(err, rows, fields) {
            if (err) throw err;
            if(rows.length > 0){
                res.json({status: "success", username: req.body.username});
            }
            else{
                res.json({status: "Wrong username or password"});
            }
        });
    }
});

app.use(express.static('public/'));
app.use(express.static('public/bootstrap/'));
app.use(express.static('public/jquery/'));
app.use(express.static('public/backbone/'));
app.use(express.static('public/images/'));
app.listen(3000, function () {
    console.log('express-handlebars example server listening on: 3000');
});