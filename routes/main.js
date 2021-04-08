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
	app.get('/register', function (req,res){	// Function that will request and resend data from register
		res.render('register.html');	// Render the register page itself
	});
	app.post('/registered', [ 
		check('username').isAlphanumeric().isLength({ min:3, max:20}).trim(),	// Validation of username input, through the use of alpha numeric characters between 3 and 20 and trimmed of white spaces
		check('email').isEmail().normalizeEmail().trim(),	// Validation of email input, check if string is an email and canonicalizes it
		check('password').isLength({min:8, max:20}),	// Validation of password input, with the minimum lenght of 8 and maximum of 20 characters
        check('firstname').isAlpha().isLength({max:20}),  // Validation of first name input as being only a maximum of 20 letters
        check('lasttname').isAlpha().isLength({max:20}),  // Validation of last name input as being only a maximum of 20 letters
	], function (req,res) {// Function that will request and resend data from registered
		
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
	    	res.redirect('./register'); 
		} else { 
		// Saving data in database         
		var MongoClient = require('mongodb').MongoClient;	// MongoDB module required
		var url = 'mongodb://localhost';
		const bcrypt = require('bcrypt');	// Initialise bcrypt
		const saltRounds = 10;	// Initialise and set the salt rounds      
		const plainPassword = req.sanitize(req.body.password);	// Assign the password typed in the form to argument plainpassword
		const sanitizeUsername = req.sanitize(req.body.username);	// Sanitize the username and assign it to a variable
		const sanitizeEmail = req.sanitize(req.body.email);	// Sanitize the email adress and assign it to a variable
		bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {    // Store hashed password in your database. 
			MongoClient.connect(url, function (err, client) {
				if (err) throw err; // Line of code that will catch and display an error message if something does not go as expected
				var db = client.db('caloriebuddy');
				db.collection('users').insertOne({	// Mongod will add the _id field and assign a unique ObjectId for the document before inserting.Will also populate the collection with the username and password value provided throught the form
				firstname:req.body.firstname,
				lastname:req.body.lastname,
				username:sanitizeUsername,	// Set typed username as username stored in the database
				email:sanitizeEmail,
				password:hashedPassword	// Set hashed password as the password stored in the database
				});
				client.close();
			// Rendered message informing the value inserted into the collection
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
		const bcrypt = require('bcrypt');	// Require bcrypt module
		const plainPassword = req.body.password; // Parse inserted password into a constant for later user
		MongoClient.connect(url, function (err, client){ 
		// Load hashed password from your password database
    		var db = client.db('caloriebuddy');
            db.collection('users').find({
			username:req.body.username}).toArray(function(err, result) {	// Iterate the database searching for a username input in the form and parse the results in a array
            	if(err) throw err;	// Line of code that will catch and display an error message if something does not go as expected
                else{	
					if (result.length == 0){	// If the lenght of the results is zero, means that no username as been found and therefore the following message is displayed
						res.send('Your username is incorrect or does not exist.' + '<br/ >' + '<br />'+'<a href='+'./'+'>Home</a>');
					} else {
							// First result of index zero is the hashed password
							var hashedPassword = result[0].password;
							bcrypt.compare(plainPassword, hashedPassword, function(err, result) {     
								if(err) throw err;
								if (result == true){	// If result is true, means username and password match the database
									// Save user session here
									req.session.userId = req.body.username;
									res.send('You are logged in. Welcome back ' + req.body.username + '<br />' + '<br/ >' + '<a href='+'./'+'>Home</a>');
								} else { // If result is not true, means that the username exists but the password is wrong
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
}
