var employees; // Establish global employees variable

// Function: When the document is ready, run the callback function
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// Object Cosntructor
var dataTable = function ( container ) {

	// Table Data
	var data = [];

	// The container ID is passed when constructed
	this.container = document.getElementById( container );

	// Private Function
	// Create a DOM element by passing parameters - returns a DOM element object
	var createElement = function ( node, string ) {
		// Create an element on the DOM
		var element = document.createElement( node );
		// If a string parameter is sent, add it to the element's HTML
		if( string !== undefined ) element.innerHTML = string;
		// Return the element
		return element;
	};

	// Add a Row
	this.add = function ( obj, callback ) {
		// Push the object
		data.push( obj );
		// If callback is a function
		if( typeof callback === "function" ) {
			// Run it with the object as its argument
			callback( obj );
		}
	};

	// Remove a Row
	this.remove = function ( index, callback ) {
		// Splice the data array at the index parameter
		data.splice( index, 1 );
		// If callback is a function, run it
		if( typeof callback === "function" ) {
			callback();
		}
	};

	// Create and return a row element
	this.row = function () {
		return createElement( "tr" );
	};

	// Create and return a cell element
	this.cell = function ( string ) {
		return createElement( "td", string );
	};

	// Return the data array
	this.getData = function () {
		return data;
	};

	// Return the number of rows (data.length)
	this.length = function () {
		return data.length;
	};

	// Return the mathematical sum of a key in all objects
	this.getTotalOfColumn = function ( key ) {
		var total = 0;
		for ( var i = 0; i < data.length; i++ ) {
			total += data[i][key];
		}
		return total;
	};

};

// When the DOM is loaded, run this stuff. Same as $(document).ready();
ready(function() {
	// Construct the employee object
	employees = new dataTable("data-display");
	// Set a variable for the table's container where we display stuff on the DOM
	container = employees.container;

	// Fake Data to play with
	employees.add({employeeId: "01", firstName: "Cody", lastName: "Ogden", jobTitle:"Developer",salary:1200});
	employees.add({employeeId: "02", firstName: "James", lastName: "Galt", jobTitle:"Developer",salary:1200});
	employees.add({employeeId: "03", firstName: "Milo", lastName: "Lucy", jobTitle:"Developer",salary:1200});

	// Remove and employee
	employees.removeEmployee = function() {
		// Get the index stored in the data attribute
		var index = this.getAttribute("data-index");
		// Method to remove a specific data object
		employees.remove( index, function () {
			// Refresh the table
			employees.refreshTable();
		} );
	};

	employees.refreshTable = function () {
		// Delete everything inside the display container
		container.innerHTML = "";

		// For every employee
		for ( var i = 0; i < employees.length(); i++ ) {
			// Variable: Employee Object
			var empObj = employees.getData()[i];

			// Variable: Get a new Table Row
			var row = employees.row();

			// Create the employee Photo
			var photo = employees.cell('<img src="images/user-circle.svg" alt="Employee Photo" />');

			// Append the photo cell to the row
			row.appendChild( photo );
			// For every key in empObj
			for ( var item in empObj ) {
				// Create a cell
				var cell = employees.cell( empObj[item] );
				// Append the cell to the row
				row.appendChild( cell );
			}

			// Variable: Create a cell whose innterHTML is the Monthly Salary of that Employee
			var monthlyCell = employees.cell( Math.round( empObj.salary / 12 ) );

			// Append the cell to the row
			row.appendChild( monthlyCell );

			// Create a remove button element
			var removeBtn = document.createElement("button");
				// Add some HTML
				removeBtn.innerHTML = '<img src="images/user-remove.svg" alt="Remove User Button Image" />';
				// Set the title attribute
				removeBtn.setAttribute("title", "Remove Employee");
				// Add an click event listener
				removeBtn.addEventListener( "click", employees.removeEmployee );
				// Set the data attribute to the index of the employee in the array
				removeBtn.setAttribute("data-index", i);

			// Create an actions cell ( to hold any buttons )
			var actionsCell = employees.cell();
				// Append the button to the cell
				actionsCell.appendChild( removeBtn );

			// Append the actions cell to the row
			row.appendChild( actionsCell );

			// Append the row to the table
			container.appendChild( row );
		}

		// Variable: Get the total monthly container
		var monthlyDisplay = document.getElementById( "total-monthly" );

		// Display the sum of all the salaries divided by 12
		monthlyDisplay.innerHTML = Math.round( employees.getTotalOfColumn("salary") / 12 );

	};

	employees.submitForm = function () {

		// Gather all user inputs into variables
		var employeeIdInput = document.getElementById("employeeIdInput");
		var firstNameInput = document.getElementById("firstNameInput");
		var lastNameInput = document.getElementById("lastNameInput");
		var jobTitleInput = document.getElementById("jobTitleInput");
		var salaryInput = document.getElementById("salaryInput");

		// Creat an employee Object
		var newEmployee = {
			employeeId: employeeIdInput.value,
			firstName: firstNameInput.value,
			lastName: lastNameInput.value,
			jobTitle: jobTitleInput.value,
			salary: Math.round( parseInt( salaryInput.value ) )
		};

		// Add the employee
		employees.add( newEmployee, function () {
			// Refresh the table
			employees.refreshTable();
		} );

		// Clear the form
		employeeIdInput.value = "";
		firstNameInput.value = "";
		lastNameInput.value = "";
		jobTitleInput.value = "";
		salaryInput.value = "";
	};

	// Refresh the table on launch
	employees.refreshTable();

});