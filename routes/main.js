module.exports = function(app)
{	const { check, validationResult } = require('express-validator');
	const redirectLogin = (req, res, next) => {
		if (!req.session.userId){
		res.redirect('./login')
		} else { 
		next ();
		}
	}

//R1--------INDEX-----------------------------------------------------------------------------------------------//
	app.get('/', function(req, res){
    	res.render('index.html');
    });

//R2--------ABOUT-----------------------------------------------------------------------------------------------//
	app.get('/about', function(req, res){
		res.render('about.html');    
	});

//R3--------REGISTRATION---------------------------------------------------------------------------------------//

app.get('/register', function (req,res){	// function that will request and resend data from register
		 res.render('register.html');	// render the register page itself
	});
	app.post('/registered',
		[check('username').isAlphanumeric().isLength({ min:3, max:20})],	// Validation of username input, through the use of alpha numeric characters between 3 and 20 and trimmed of white spaces
		[check('email').normalizeEmail().isEmail()],	// Validation of email input, check if string is an email and canonicalizes it
		[check('password').isLength({min:8, max:20})],	// Validation of password input, with the minimum lenght of 8 and maximum of 20 characters
		[check('firstname').isAlpha().isLength({max:20})],  // Validation of first name input as being only a maximum of 20 letters
		[check('lasttname').isAlpha().isLength({max:20})],  // Validation of last name input as being only a maximum of 20 letters

		function (req,res) {     // function that will request and resend data from registered
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
	            res.redirect('./register'); 
		} else { 
		//saving data in database         
		var MongoClient = require('mongodb').MongoClient;	// MongoDB module required
		var url = 'mongodb://localhost';
		const bcrypt = require('bcrypt');	// initialise bcrypt
		const saltRounds = 10;	// initialise and set the salt rounds      
		const plainPassword = req.sanitize(req.body.password);	// assign the password typed in the form to argument plainpassword
		const sanitizeUsername = req.sanitize(req.body.username);	//sanitize the username and assign it to a variable
		const sanitizeEmail = req.sanitize(req.body.email);	//sanitize the email adress and assign it to a variable
		bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {    // Store hashed password in your database. 
			MongoClient.connect(url, function (err, client) {
				if (err) throw err; // line of code that will catch and display an error message if something does not go as expected
				var db = client.db('caloriebuddy');
				db.collection('users').insertOne({	//mongod will add the _id field and assign a unique ObjectId for the document before inserting.Will also populate the collection with the username and password value provided throught the form
				firstname:req.body.firstname,
				lastname:req.body.lastname,
				username:sanitizeUsername,	// set typed username as username stored in the database
				email:sanitizeEmail,
				password:hashedPassword	//set hashed password as the password stored in the database
				});
				client.close();
			// rendered message informing the value inserted into the collection
			res.send('You are now registered '+ req.body.firstname + ' ' + req.body.lastname + '. ' + '<br />' + 'Your username is: '+ req.body.username + ', your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword + '<br />' + 'Have a nice day!' + '<br/ >'+ '<br/ >' + '<a href=' + './' + '>Home</a>');
			});  
		});
	}
});





//R4--------LOGIN---------------------------------------------------------------------------------------//

app.get('/login', function (req,res){
		res.render('login.html');
	});
	app.post('/loggedin', function(req,res){
		var MongoClient = require('mongodb').MongoClient;
                var url = 'mongodb://localhost';
		const bcrypt = require('bcrypt');	// require bcrypt module
		const plainPassword = req.body.password; // parse inserted password into a constant for later user
		MongoClient.connect(url, function (err, client){ 
		// Load hashed password from your password database
                        var db = client.db('caloriebuddy');
                        db.collection('users').find({
			username:req.body.username}).toArray(function(err, result) {	//iterate the database searching for a username input in the form and parse the results in a array
                                if(err) throw err;	// line of code that will catch and display an error message if something does not go as expected
                                else{	
					if (result.length == 0){	// if the lenght of the results is zero, means that no username as been found and therefore the following message is displayed
						res.send('Your username is incorrect or does not exist.' + '<br/ >' + '<br />'+'<a href='+'./'+'>Home</a>');
					} else {
						 //first result of index zero is the hashed password
						var hashedPassword = result[0].password;
						bcrypt.compare(plainPassword, hashedPassword, function(err, result) {     
							if(err) throw err;
							if (result == true){	// if result is true, means username and password match the database
								// save user session here
								req.session.userId = req.body.username;
								res.send('You are logged in.' + '<br/>' + ' Welcome back ' + req.body.username + '! ' + '<br />' + '<br/ >' + '<a href='+'./'+'>Home</a>');
							}
							else{ // if result is not true, means that the username exists but the password is wrong
								res.send('Your password is incorrect. Try again: '+ '<a href='+'./login'+'>login page</a>' + '<br />'+ '<br/ >' + '<a href='+'./'+'>Home</a>');
							}		 
						});
						}
				}
			});
                	client.close();
		});
	});




//R5--------LOGOUT---------------------------------------------------------------------------------------//
    app.get('/logout', redirectLogin, (req,res) => {      
		req.session.destroy(err => {      
		if (err) {        
			return res.redirect('./')      
		}
		res.send('You are now logged out ' + req.body.username + '.' + '<br />'+ '<br/ >' + '<a href='+'./'+'>Home</a>');      
		})    
	})

//R6--------ADD FOOD---------------------------------------------------------------------------------------//
	// addfood
	app.get('/addfood', redirectLogin, function (req,res){
		res.render('addfood.html');
	});

	// foodadded
	app.post('/foodadded', check('name').not().isEmpty(), function(req, res){
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			res.send('There cannot be empty fields, ' + '<a href='+'./addfood'+'>please try again.</a>' + '<br />'+ '<br/ >' + '<a href='+'./'+'>Home</a>');
		} 
		else{	
        // saving data in database
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        	MongoClient.connect(url, function(err, client) {
        	if (err) throw err;
			var db = client.db ('caloriebuddy'); 
         		db.collection('foods').insertOne({ 
         		name: req.body.name,
                	typicalValues: req.body.typicalvalues,
                	unitOfTheTypicalValue: req.body.unit,
                	calories: req.body.calories,
                	carbs: req.body.carbs,
                	fat: req.body.fat,
                	protein: req.body.protein, 
                	salt: req.body.salt,
                	sugar: req.body.sugar,
			username: req.session.userId
         		});
         		client.close()
                 
                 res.send('The following food has been added to the database:' + '<br />' + '<br />' +
                        'Name: ' + req.body.name + '<br />' +
                        'Typical Values: ' + req.body.typicalvalues + '<br />' +
                        'Unit of The typical value: ' + req.body.unit + '<br />' +
                        'Calories: ' + req.body.calories + '<br />' +
                        'Carbs: ' + req.body.carbs + '<br />' +  
                        'Fat: ' + req.body.fat + '<br />' +
                        'Protein: ' + req.body.protein + '<br />' +
                        'Salt: ' + req.body.salt + '<br />' +
                        'Sugar: ' + req.body.sugar + '<br />' + '<br />' +
                        '<a href='+'/addfood'+'>Add more food</a>'+'<br />'+ '<br />'+
                        '<a href='+'./'+'>Home</a>');
                 });
	}
	});

//R7--------SEARCH-FOOD---------------------------------------------------------------------------------------// 

	app.get('/searchfood', redirectLogin,function(req,res){
                res.render("searchfood.html");
        });
        //result of search
        app.get('/search-result',function (req,res){
                //searching in the database
                var MongoClient = require('mongodb').MongoClient;
                var url = 'mongodb://localhost';
                        MongoClient.connect(url, function(err, client) {
                                if(err) throw err;
                                var db = client.db('caloriebuddy');
                                db.collection('foods').find({name:{$regex:req.query.keyword, $options:'i'}}).toArray((findErr, results) => {
                                if (findErr) throw findErr;
                                else{
                                        if (results.length==0){
                                                res.send('No matches have been found, ' + '<a href=' + './searchfood' + '>try again.</a>' + '<br />' + '<br/ >' + '<a href='+'./'+'>Home</a>');
                                }
                                else{
                                //if items have been found, rendering results
                                        res.render('searchedfood.ejs', {availablefoods: results});
                                }
                                client.close();
                                }
                                });

                        });
        });

//R8--------UPDATE-FOOD---------------------------------------------------------------------------------------// 

//R9--------LIST-FOOD----------------------------------------------------------------------------------------//
	app.get('/listfood', redirectLogin, function(req, res) { 
        var MongoClient = require('mongodb').MongoClient;	// MongoDB module is required here
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {	// MongoDB client is initiated through a function
                if (err) throw err;	// line of code that will catch and display an error message if something does not go as expected
                        var db = client.db('caloriebuddy');
                        db.collection('foods').find().toArray((findErr, results) => {	//retrieve all foods in database under colletion "foods"
                        if (findErr) throw findErr;	// line of code that will catch and display an error message if something does not go as expected
                        else{
				if (results.length == 0){	// if database empty, then show the following message
					res.send('There are no foods records in the database.' + '<br />'+'<a href='+'./'+'>Home</a>');
				} else {	// if the database is not empty, render listfood page with the result which will display a list of foods
	                                res.render('listfood.ejs', {availablefoods:results});	// render the result in a list
        	                        client.close();	// MongoDB is closed                                    
				}
			}
                        });
                });
        });


//R10-----API---------------------------------------------------------------------------------------// 
	app.get('/api', function (req,res) {
		var MongoClient = require('mongodb').MongoClient;      
		var url = 'mongodb://localhost';      
		MongoClient.connect(url, function (err, client) {      
			if (err) throw err
			var db = client.db('caloriebuddy');
			db.collection('foods').find().toArray((findErr, results) => {
				if (findErr) 
					throw findErr;       
				else          
					res.json(results);
					client.close();
			}); 
		}); 
	});








}
