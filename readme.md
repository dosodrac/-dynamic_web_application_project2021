READ ME FILE
///////////////////////
Requirements list
R1: Home page:
The name of the app is display with a huge heading 1 and a navigation bar is present in all the pages
R2: About page: 
In this page theres a small text about this project and I refer myself as the developer.
R3: Register page:
To allow users to register, I have created the file register.html. Here users will see a form that will collect data to be passed to the back-end.
I have placed validation and sanitation. This is crucial for a protected database. In main.js, lines 26  31, is possible to visualize the validation in place such as:
	Is the username only letters and numbers
	Is the email actually a email string
	Does the password have between 8 and 20 characters 
	Does the first name only contain letters and up to 20 characters
	Does the last name only contain letters and up to 20 characters

	Validation 
o	Username
	Alphanumeric
	length min3 - max20
	trims characters (whitespace by default) at the beginning and at the end of a string
o	Email
	check if the string is an email.
	canonicalizes an email address.
o	Password
	Length min 8  max20
o	First name
	Only letters
	Length max20
o	Last name
	Only letters
	Length max 20

Additionally, in main.js, lines 43 to 45 the code sanitises the password, username and email inputs. In the same file, line 46, bcrypt hashes the password provided and only the hashed password is safed in the database, never the plain one.
Once the user presses Submit, if theres no errors in validation (main.js, lines 35 to 37), a message will confirm the registration (main.js file, line 59).
R4: Login page:
R5: Logout
R6: Add food page
Validation in addfood.html, lines 48, 60, 64, 68,72,76)
	Input number
o	Min 0 = no negatives

R7: Search food page 
R8: Update food page 
R9: List food page
R10: API
R11: form validation
R12: MongoDB

