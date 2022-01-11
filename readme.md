# Dynamic web application project (2021)

In this project I have developed a small dynamic web application and the necessary routes, forms, and database access. This web application purpose is to be as a digital calorie counter to help users manage their diet. Fundamentally, the dynamic web application interacts with users to calculate and display nutritional facts including calories for their recipes or meals based on food ingredients in the recipe or the meal. If a food ingredient is not in the database the user should be given the choice to add it to the database.

This project is implemented in Node.js on a virtual server, the back-end of the web application has a database MongoDB that implements CRUD operations.

-----

## Table of contents
* [Main features](#main-features)
* [Screenshoots](#screenshots)

-----

## Main features 
These are the main features that I have implemented:

* Registration/login 
	* Validation. I have used isLength for the username input, first and last name inputs and also password length; isEmail to validate of email input; isEmpty as a validation that the required fields are not empty; isAlphanumeric as validation in the username input.
	* Sanitation. I have used trim() in the email input
	* Security of data in storage. A hashed password is created and stored in the database instead of saving the plain password.
* When searching food, collects form data passed to the database and search it. If found display a ejs file, if not inform the user. Search will apply to any instance of the keyword.
* Pages login protected.

-----

## Screenshots
<img src="https://github.com/dosodrac/dynamic_web_application_project2021/blob/master/Screenshoots/00.%20Homepage.png" width="30%"></img>
<img src="https://github.com/dosodrac/dynamic_web_application_project2021/blob/master/Screenshoots/01.%20Register.png" width="30%"></img> 
<img src="https://github.com/dosodrac/dynamic_web_application_project2021/blob/master/Screenshoots/01.1%20New%20user%20registered.png" width="30%"></img> 
<img src="https://github.com/dosodrac/dynamic_web_application_project2021/blob/master/Screenshoots/02.%20Login.png" width="30%"></img> 
<img src="https://github.com/dosodrac/dynamic_web_application_project2021/blob/master/Screenshoots/03.%20Add%20food.png" width="30%"></img> 
<img src="https://github.com/dosodrac/dynamic_web_application_project2021/blob/master/Screenshoots/04.%20Search%20food.png" width="30%"></img> 
<img src="https://github.com/dosodrac/dynamic_web_application_project2021/blob/master/Screenshoots/04.1.%20Food%20results.png" width="30%"></img> 
<img src="https://github.com/dosodrac/dynamic_web_application_project2021/blob/master/Screenshoots/05.%20Update%20food.png" width="30%"></img> 
<img src="https://github.com/dosodrac/dynamic_web_application_project2021/blob/master/Screenshoots/06.%20List%20food.png" width="30%"></img> 
<img src="https://github.com/dosodrac/dynamic_web_application_project2021/blob/master/Screenshoots/07.%20API.png" width="30%"></img> 
