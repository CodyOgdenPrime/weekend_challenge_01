var employeeSalaryCalc = function () {
	var employeeData = [];
	var formFields = [];
	var defaultMessageElement = document.getElementById( "defaultDisplay" );
	var private;

	// Private Functions
	var addEmployee = function () {
		console.log( "Add Employee" );
	};

	var removeEmployee = function () {
		console.log( "Remove Employee" );
	};

	var refreshEmployees = function () {

	};

	var getButtonNode = function ( text, callback ) {
		// Create Button Node
		var button = document.createElement( "button" );
		// Add Text to the Button
		button.innerHTML = text;
		// Set Click Event Listener
		button.addEventListener( "click", callback );
		// Return Button Node
		return button;
	};

	var getCellNode = function ( text ) {

	};

	var getRowNode = function () {

	};

	// Public Methods
	this.add = function() {
		return addEmployee();
	};

	this.remove = function () {
		return removeEmployee();
	};

	this.show = function () {
		return refreshEmployees();
	};

	// Private Function
	// Ensure Salary is only a number
	// Returns false if can't force a number
	var sanitizeSalary = function ( inputStr ) {

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

		var digit = parseInt( inputArr[i] );
			// If is Not a Number, return false
			if( isNaN( digit ) ) {
				return false;
			}
			// If not, put it back in the string
			inputStr += inputArr[i];
		}
		// Parse string of integers into a number
		inputStr = parseInt( inputStr );
		// Return the number
		return inputStr;
	};

};

employees = new employeeSalaryCalc();