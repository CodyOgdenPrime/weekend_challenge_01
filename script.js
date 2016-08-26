var employees = new Object();

employees.data = [];
employees.fields = ["firstNameInput","lastNameInput","employeeIdInput","jobTitleInput","salaryInput"];

employees.addEmployee = function () { // Add a new employee

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

employees.resetForm = function () { // Resets the add employee form
	// Loop through all form fields and set value to empty
	for( var i = 0; i < this.fields.length; i++ ) {
		document.getElementById( this.fields[i] ).value = "";
	}
	return true;
}

employees.displayEmployees = function () { // Generate and display all employees in the DOM
	// Get the container element
	var display = document.getElementById("dataDisplay");
	display.innerHTML = "";
	if( this.data.length < 1 ) {
		// If the data.length is less than one ( no data exists ) show a default message
		display.innerHTML = '<td colspan="6" id="defaultDisplay">No Employees</td>';
	} else {
		// If there is data, loop through it and concat a string to display inside the container
		for ( var i = 0; i < this.data.length; i++ ) {
			display.innerHTML += '<tr>' +
									'<td>' + this.data[i].employeeId + '</td>' +
									'<td>' + this.data[i].firstName + '</td>' +
									'<td>' + this.data[i].lastName + '</td>' +
									'<td>' + this.data[i].jobTitle + '</td>' +
									'<td>' + ( this.data[i].salary / 12 ) + '</td>' +
									'<td><a onclick="event.preventDefault(); employees.removeEmployee(' + i + ')">[ X ]</a></td>' +
								'</tr>';
		}
	}
	// Always update the monthly salary total
	this.displayTotalMonthlySalary();
}

employees.removeEmployee = function ( employeeIndex ) { // Remove an employee
	var confirmation = window.confirm("Are you sure?"); // Confirm popup
	if ( confirmation ) {
		// If the user confirms
		this.data.splice( employeeIndex, 1 ); // Remove the employee
		this.displayEmployees(); // Display the employees
	} else {
		return false;
	}
	
}

employees.displayTotalMonthlySalary = function () { // Places the Total Monthly Salary into the correct table cell
	var cell = document.getElementById( "salaryTotal" );
	cell.innerHTML = this.getTotalMonthlySalary();
}

employees.getTotalMonthlySalary = function () { // Gets the Total Monthly Salary
	var total = 0;
	for( var i = 0; i < this.data.length; i++ ) {
		total += parseInt( this.data[i].salary );
	}
	return ( total / 12 );
}