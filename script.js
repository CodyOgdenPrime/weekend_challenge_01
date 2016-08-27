// Let's preserve the namespace
var employeeSheet = function () {
	// Initialize the employee datastore
	var data = [];
	// Faux serializing the data
	var formFields = ["firstNameInput","lastNameInput","employeeIdInput","jobTitleInput","salaryInput"];
	// Preserves the "No Employees" view
	var defaultMessage = document.getElementById( "defaultDisplay" );
	// Add a new employee
	this.addEmployee = function () {
		// Ensure all form fields were filled out, else return false
		for( var i = 0; i < formFields.length; i++ ) {
			var field = document.getElementById( formFields[i] ).value;
			// console.log( employeeData[i] );
			if ( field === null || field === "" ) {
				console.error( "Form Data must be complete." );
				return false;
			}
		}
		// Create a new employee object
		var newEmployee = {
			employeeId: 	document.getElementById( formFields[2] ).value,
			firstName: 		document.getElementById( formFields[0] ).value,
			lastName:  		document.getElementById( formFields[1] ).value,
			jobTitle: 		document.getElementById( formFields[3] ).value,
			salary: 		parseInt( document.getElementById( formFields[4] ).value )
		};
		// Reset the add employee form ( clears all fields )
		this.resetForm();
		// Add the employee to data array
		data.push( newEmployee );
		// Update the employee list
		this.displayEmployees();
	};
	// Resets the add employee form
	this.resetForm = function () { 
		// Loop through provided form fields
		for( var i = 0; i < formFields.length; i++ ) {
			// Set each field's value to empty
			document.getElementById( formFields[i] ).value = "";
			// Focus on the ID field for better user experience
			document.getElementById( formFields[2] ).focus();
		}
		return true;
	};

	this.removeButton = function ( index ) {
		var container = document.createElement( "td" );
		var element = document.createElement( "button" );
		element.innerHTML = "Remove Employee";
		element.setAttribute( "data-index", index );
		element.addEventListener( "click", this.removeEmployee );
		container.appendChild( element );
		return container;
	};

	this.getEmployeeRow = function ( employee ) {

		var row = document.createElement( "tr" );

		var td = function ( text ) {
			var element = document.createElement( "td" );
			var textNode = document.createTextNode( text );
			element.appendChild( textNode );
			return element;
		};

		for ( var cell in employee ) {
			row.appendChild ( td( employee[cell] ) );
		}

		return row;

	};

	// Generate and display all employees in the DOM
	this.displayEmployees = function () { 
		// Get the container element
		var display = document.getElementById("dataDisplay");
		// Clear the display
		display.innerHTML = "";
		// If there are no employee objects present in the dataset
		if( data.length < 1 ) {
			// Show the default message
			display.innerHTML = '<td colspan="6" id="defaultDisplay">No Employees</td>';
		} else {

			for( var i = 0; i < data.length; i++ ) {
				var elements = this.getEmployeeRow( data[i] );
				var button = this.removeButton( i );
				elements.appendChild( button );
				display.appendChild( elements );
			}

		}
		// Update the salary total each time - Pro Mode
		this.displayTotalMonthlySalary();
	};

	var displayEmployees = 
	// Remove an employee
	// The function call built into HTML passes the employee's indexOf
	var removeEmployee = function ( index ) {

		

		// Ask user if they are sure they want to delete the employee
		var confirmation = window.confirm("Are you sure?");
		// If the user says confirms
		if ( confirmation ) {
			// Remove the employee from the dataset array
			data.splice( index, 1 );
			// Regenerate the display view
			displayEmployees(); // Display the employees
		} else {
			return false;
		}
		
	};

	this.removeEmployee = function () {
		var employeeIndex = this.getAttribute( "data-index" );
		removeEmployee( employeeIndex );
	};
	// Places the Total Monthly Salary into the correct table cell
	this.displayTotalMonthlySalary = function () {
		// Find the salaryTotal cell
		var cell = document.getElementById( "salaryTotal" );
		// Replace its HTML with the totalMonthlySalary number
		cell.innerHTML = this.getTotalMonthlySalary();
	};
	// Returns the Total Monthly Salary
	this.getTotalMonthlySalary = function () {
		// Set total to 0
		var total = 0;
		// Loop through each employee object in the dataset
		for( var i = 0; i < data.length; i++ ) {
			// Add the salaries to the total
			total += parseInt( data[i].salary );
		}
		// Find the total Monthly Salary
		total = ( total / 12 );
		// Return the Total Monthly Salary
		return total;
	};
};

var employees = new employeeSheet();