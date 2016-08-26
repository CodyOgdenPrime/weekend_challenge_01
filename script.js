// Let's preserve the namespace
var employees = new Object();
// Initialize the employee datastore
employees.data = [];
// Faux serializing the data
employees.fields = ["firstNameInput","lastNameInput","employeeIdInput","jobTitleInput","salaryInput"];
// Preserves the "No Employees" view
employees.defaultMessage = document.getElementById( "defaultDisplay" );
// Add a new employee
employees.addEmployee = function () {
	// Ensure all form fields were filled out, else return false
	for( var i = 0; i < this.fields.length; i++ ) {
		var field = document.getElementById( this.fields[i] ).value;
		// console.log( employeeData[i] );
		if ( field == null || field == "" ) {
			console.error( "Form Data must be complete." );
			return false;
		}
	}
	// Create a new employee object
	var newEmployee = {
		firstName: 		document.getElementById( this.fields[0] ).value,
		lastName:  		document.getElementById( this.fields[1] ).value,
		employeeId: 	document.getElementById( this.fields[2] ).value,
		jobTitle: 		document.getElementById( this.fields[3] ).value,
		salary: 		parseInt( document.getElementById( this.fields[4] ).value )
	}
	// Reset the add employee form ( clears all fields )
	this.resetForm();
	// Add the employee to data array
	this.data.push( newEmployee );
	// Update the employee list
	this.displayEmployees();
}
// Resets the add employee form
employees.resetForm = function () { 
	// Loop through provided form fields
	for( var i = 0; i < this.fields.length; i++ ) {
		// Set each field's value to empty
		document.getElementById( this.fields[i] ).value = "";
		// Focus on the ID field for better user experience
		document.getElementById( this.fields[2] ).focus();
	}
	return true;
}
// Generate and display all employees in the DOM
employees.displayEmployees = function () { 
	// Get the container element
	var display = document.getElementById("dataDisplay");
	// Clear the display
	display.innerHTML = "";
	// If there are no employee objects present in the dataset
	if( this.data.length < 1 ) {
		// Show the default message
		display.innerHTML = '<td colspan="6" id="defaultDisplay">No Employees</td>';
	} else {
		// If there is data, loop through them
		for ( var i = 0; i < this.data.length; i++ ) {
			// Concat a string of HTML for each employee object and build a table row
			display.innerHTML += '<tr>' +
									'<td>' + this.data[i].employeeId + '</td>' +
									'<td>' + this.data[i].firstName + '</td>' +
									'<td>' + this.data[i].lastName + '</td>' +
									'<td>' + this.data[i].jobTitle + '</td>' +
									'<td>' + ( this.data[i].salary / 12 ) + '</td>' +
									'<td><button onclick="event.preventDefault(); employees.removeEmployee(' + i + ')">Remove Employee</button></td>' +
								'</tr>';
		}
	}
	// Update the salary total each time - Pro Mode
	this.displayTotalMonthlySalary();
}
// Remove an employee
// The function call built into HTML passes the employee's indexOf
employees.removeEmployee = function ( employeeIndex ) {
	// Ask user if they are sure they want to delete the employee
	var confirmation = window.confirm("Are you sure?");
	// If the user says confirms
	if ( confirmation ) {
		// Remove the employee from the dataset array
		this.data.splice( employeeIndex, 1 );
		// Regenerate the display view
		this.displayEmployees(); // Display the employees
	} else {
		return false;
	}
	
}
// Places the Total Monthly Salary into the correct table cell
employees.displayTotalMonthlySalary = function () {
	// Find the salaryTotal cell
	var cell = document.getElementById( "salaryTotal" );
	// Replace its HTML with the totalMonthlySalary number
	cell.innerHTML = this.getTotalMonthlySalary();
}
// Returns the Total Monthly Salary
employees.getTotalMonthlySalary = function () {
	// Set total to 0
	var total = 0;
	// Loop through each employee object in the dataset
	for( var i = 0; i < this.data.length; i++ ) {
		// Add the salaries to the total
		total += parseInt( this.data[i].salary );
	}
	// Find the total Monthly Salary
	total = ( total / 12 );
	// Return the Total Monthly Salary
	return total;
}