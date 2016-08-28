/* Sunday Notes:

	Goals for Sunday:
		- Only Put Controllers that directly affect the table into the main function/class
		- Move any data validation and form handling outside of the main function/class
		- Maybe remove things from the DOM a little lighter than looping through everything over and over

	Other Ideas
		- Redo it in jQuery
*/

/*

General Notes for people poking around this code:

My goal was was to make an object with methods that handles
interacting with the table much easier.

*/



var employeeSalaryTable = function () {
	var data = [];
	var defaultMessageElement = document.getElementById( "defaultDisplay" );

	/*
	 * Functions
	 */

	var addEmployee = function ( newEmployee ) {

		// If a new employee object is *not* passed to the function
		// Get the information from the DOM

		if( newEmployee === undefined ) {

			// Get all Inputs and Set Them As Variables
			var employeeIdInput	= document.getElementById("employeeIdInput");
			var firstNameInput	= document.getElementById("firstNameInput");
			var lastNameInput	= document.getElementById("lastNameInput");
			var jobTitleInput	= document.getElementById("jobTitleInput");
			var salaryInput		= document.getElementById( "salaryInput" );

			// Ensure we have correct types for our data ( salary is a number )

			// Sanitize the Salary Given by the User (returns undefined or number)
			var salarySanitize = sanitizeSalary( salaryInput.value );

			// If salaryOut is undefined
			if ( salarySanitize === undefined ) {

				// Show an alert to the user that salary can only be a number
				errorAlert( "Salary can only be a number!", true );
				return false;

			}

			// Build the employee object
			var newEmployee = {
				id: employeeIdInput.value,
				firstName: firstNameInput.value,
				lastName: lastNameInput.value,
				jobTitle: jobTitleInput.value,
				salary: salarySanitize
			};

			// Ensure all fields have input

			// For each key in newEmployee
			for( var item in newEmployee ) {
				switch ( newEmployee[item] ) {
					case "":
					case undefined:
					case null:
						errorAlert( "All form fields must be filled out.", true );
						return false;
				}
			}


			// Clear the Add New Employee Form
			employeeIdInput.value = "";
			firstNameInput.value = "";
			lastNameInput.value = "";
			jobTitleInput.value = "";
			salaryInput.value = "";

		}

		// If all sanitation and checks have passed
		// Add the employee to the employee array
		data.push( newEmployee );

		// Refresh the Employee Table & Analytics ( e.g. Monthly Paid Out )
		refreshEmployees();

	};

	// Simple node creation
	var createElement = function ( node, text ) {

		// Create an element with the given parameter
		var element = document.createElement( node );

		// Find the data type of text
		var textType = typeof text;

		switch ( textType ) {
			case "string":
			case "number":
			case "symbol":
				element.innerHTML = text;
				break;
		}

		// Send the element back
		return element;

	};

	var errorAlert = function ( message, showAlert ) {
		if ( showAlert === true ) {
			alert( message );
		}
		console.error( message );
		return false;
	};

	var refreshEmployees = function () {

		// Set our display area
		var display = document.getElementById("data-display");

		// Remove Everything from the Display
		display.innerHTML = "";

		// For each employee
		for ( var i = 0; i < data.length; i++ ) {



			// Create our Row Element
			var row = createElement( "tr" );

			// Create the profile image
			var employeeImg = createElement( "img" );

			// Set img attributes
			employeeImg.setAttribute("src","images/user-circle.svg");
			employeeImg.setAttribute("title","Fake User Image");
			employeeImg.setAttribute("alt","Fake User Image");

			// Create photoCell to hold img
			var photoCell = createElement( "td" );

			// Append img to photoCell
			photoCell.appendChild( employeeImg );

			// Add the cell to our row
			row.appendChild( photoCell );

			// For each key in our objects
			for ( var item in data[i] ) {

				// Create a new cell
				var cell = createElement( "td", data[i][item] );

				// Append the cell to the row
				row.appendChild( cell );

			}

			// Create Montly Salary Table Cell
			var monthlySalaryCell = createElement( "td", Math.round( data[i].salary / 12 ) );

			// Add this to the employee row
			row.appendChild( monthlySalaryCell );

			// Create the remove employee image and add some attributes
			var removeEmployeeImg = createElement( "img" );
			removeEmployeeImg.setAttribute("src","images/user-remove.svg");
			removeEmployeeImg.setAttribute("title","Remove Employee");
			removeEmployeeImg.setAttribute("alt","Click to Remove Employee");

			// Create the remove employee button
			var removeEmployeeButton = createElement("button");

			// Append the image to the button
			removeEmployeeButton.appendChild( removeEmployeeImg );

			// Set `data-index` attribute which refernces data[i]
			removeEmployeeButton.setAttribute( "data-index", i );

			// Add an event listener for click
			removeEmployeeButton.addEventListener( "click", removeEmployeeClickHandler );

			// Create the Actions cell for each employee row
			var actionsCell = createElement( "td" );

			// Add Button to the Actions Cell
			actionsCell.appendChild( removeEmployeeButton );

			// Add the actions cell to the Row
			row.appendChild( actionsCell );

			// Append the row to the table
			display.appendChild( row );

		}

	};

	var removeEmployee = function ( index ) {

		// Splice the employee from the array
		data.splice( index, 1 );

		// Refresh the Employee Table & Analytics ( e.g. Monthly Paid Out )
		refreshEmployees();

	};

	var removeEmployeeClickHandler = function () {

		// Get the index stored in the button's data attribute
		var index = this.getAttribute("data-index");

		// Send it to the removeEmployee function
		return removeEmployee( index );
	};

	var sanitizeSalary = function ( inputStr ) {

		// To string so we can play with it
		inputStr = String( inputStr );

		// Split inputStr's digits into array
		var inputArr = inputStr.split("");

		// Clear the input string
		inputStr = "";

		// If the first digit is a dollar sign, boot it.
		if( inputArr[0] === "$" ) {
			inputArr.shift();
		}

		// Loop to check other digits
		for ( var i = 0; i < inputArr.length; i++ ) {

		// Select each digit from the array
		// Parse it into a number
			var digit = parseInt( inputArr[i] );

			// If is "Not a Number", return false
			if( isNaN( digit ) ) {
				return undefined;
			}

			// If not, put it back in the string
			inputStr += inputArr[i];

		}

		// Parse string of integers into a number
		inputStr = parseInt( inputStr );

		// If the final result is NaN
		if( isNaN( inputStr ) ) {
			return undefined;
		} else {
			// Return the number
			return inputStr;
		}
	};

	var monthlyTotalSalary = function () {
		// Variable to calculate total expenditure
		var monthlyExp = 0;

		for ( var i = 0; i < data.length; i++ ) {

			// Add Monthly Salary to Company Wide Monthly Expenditure
			monthlyExp += Math.round( data[i].salary / 12 );

		}

		return monthlyExp;
	};

	var yearlyTotalSalary = function () {
		// Variable to calculate total expenditure
		var monthlyExp = 0;

		for ( var i = 0; i < data.length; i++ ) {

			// Add Monthly Salary to Company Wide Monthly Expenditure
			monthlyExp += Math.round( data[i].salary );

		}

		return monthlyExp;
	};

	/*
	 * Methods
	 */
	this.add = function( obj ) {
		// Allows external scripts to add data
		return addEmployee( obj );
	};

	/*this.edit = function () {
		// Stretch goal for Sunday
	};*/

	this.refresh = function () {
		return false;
	};

	this.remove = function( index ) {
		// Externally remove an employee
		return removeEmployee( index );
	};

	this.fetch = function ( request ) {
		// Fetch specific data
		switch ( request ) {

			case "employeeCount":
				// Returns number of employees
				return data.length; 

			default:
				// Attempts to run a function
				return eval( request )(); 

		}
	};

};

employees = new employeeSalaryTable();







/*

	MR ROBOT SEASON 2 (MILD) SPOILERS BELOW

*/






















// Add some fake data to play with
function mrRobot() {

	employees.add({
		id: "01",
		firstName: "Elliot",
		lastName: "Alderson",
		jobTitle: "Mr. Robot",
		salary: 0
	});

	employees.add({
		id: "02",
		firstName: "Darlene",
		lastName: "Alderson",
		jobTitle: "Hacker Chick",
		salary: 100000
	});

	employees.add({
		id: "03",
		firstName: "Angela",
		lastName: "Moss",
		jobTitle: "Marketing Director",
		salary: 95000
	});

	employees.add({
		id: "04",
		firstName: "Tyrell",
		lastName: "Wellick",
		jobTitle: "Unemployeed",
		salary: 250000
	});

	employees.add({
		id: "05",
		firstName: "Joanna",
		lastName: "Wellick",
		jobTitle: "Housewife",
		salary: 0
	});

	employees.add({
		id: "06",
		firstName: "Phillip",
		lastName: "Price",
		jobTitle: "Chief Executive Office",
		salary: 9000000
	});

	employees.add({
		id: "07",
		firstName: "Gideon",
		lastName: "Goddard",
		jobTitle: "Deceased",
		salary: 0
	});

	employees.add({
		id: "08",
		firstName: "Ollie",
		lastName: "Parker",
		jobTitle: "Computer Analyst",
		salary: 65000
	});

}