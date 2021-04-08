var express = require ('express');	// Inclusion of Express module
var session = require ('express-session');	// Inclusion of Express Session module
var validator = require ('express-validator')	// Inclusion of the validator module
const expressSanitizer = require ('express-sanitizer')	// Inclusion of the sanitizer module
const app = express(); 
const port = 8000;
var MongoClient = require('mongodb').MongoClient; // Inclusion of Mongo module
var url = "mongodb://localhost/caloriebuddy";  

//----------------------------------------------------------------------------------------------//
app.use(express.static('views'));
app.use(expressSanitizer());

//----------------------------------------------------------------------------------------------//
// Added for session management 
        app.use(session({
                secret: 'somerandomstuffs',
                resave: false,
                saveUninitialized: false,
                cookie: {
                expires: 600000                                                                                                                                         
                }
	}));

//----------------------------------------------------------------------------------------------//
MongoClient.connect(url, function(err, db) {// MongoDB connection
   if (err) throw err;
   console.log("Database created!");
   db.close();
});

//----------------------------------------------------------------------------------------------//
// Node.js body parsing middleware, responsable for parsing the incoming request bodies in a middleware
var bodyParser= require ('body-parser')         
	app.use(bodyParser.urlencoded({ extended: true }))
        require('./routes/main')(app);
        app.set('views',__dirname + '/views');
        app.set('view engine', 'ejs');
        app.engine('html', require('ejs').renderFile);
        //
        app.listen(port, () => console.log(`Example app listening on port ${port}!`));
