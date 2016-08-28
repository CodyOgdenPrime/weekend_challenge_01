var employeeSalaryTable = function () {
	var data = [];
	var defaultMessageElement = document.getElementById( "defaultDisplay" );

	/*
	 * Functions
	 */

	var addEmployee = function () {

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

		// If all sanitation and checks have passed
		// Add the employee to the employee array

		data.push( newEmployee );

		// Refresh the Employee Table & Analytics ( e.g. Monthly Paid Out )

		refreshEmployees();

		// Clear the Add New Employee Form

		employeeIdInput.value = "";
		firstNameInput.value = "";
		lastNameInput.value = "";
		jobTitleInput.value = "";
		salaryInput.value = "";

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
			case "object":
				// Isn't perfect. Could sanitize the object
				// To find ensure it is a real Node
				// For this...not going to go that far
				element.appendChild( text );
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

	};

	var removeEmployee = function ( index ) {
		console.log( index );
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

	/*
	 * Methods
	 */
	this.add = function() {
		return addEmployee();
	};

	this.edit = function () {
		// Stretch goal for Sunday
	};

	this.fetch = function () {
		return data;
	};

	this.remove = function () {
		var index = this.getAttribute("data-index");
		return removeEmployee( index );
	};
};

employees = new employeeSalaryTable();