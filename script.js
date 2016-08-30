var tableRunner = function ( settings ) {

	// Is the tonainer element with the ID passed in settings object
	this.container = document.getElementById( settings.containerId );

	// This is the main data store for anything in the table.
	var tableData = {
		columns: settings.columns,
		rows: []
	};

	// Array of all column types (e.g. function, string, number)
	var columnTypes = function () {
		var types = [];
		tableData.columns.map( function ( obj ) {
			types[obj.slug] = obj.dataType;
		});
		return types;
	};

	// Array of all Column Slugs
	var columnSlugs = tableData.columns.map( function ( obj ) {
												return obj.slug;
											} );

	// Checks validity and then adds a data object
	this.add = function ( obj, callback ) {

		// Open new array to store our columns
		var columns = tableData.columns;

		// Array of Column Slugs : dataType
		var colTypes = columnTypes();

		for( var item in obj ) {

			// Ensure only established columns are sent
			if ( columnSlugs.indexOf( item ) < 0 ) {
				console.error( "Key in object is not a registered column slug.", obj );
				return false;
			}
			
			// Each value must match the same type registered
			if ( colTypes[item] !== typeof obj[item] ) {
				console.error( "Data type is not the same as registered data type for this column: " + item + ". The registereted data type is " + columnTypes[item] + ", but a '" + typeof obj[item] + "' has been supplied.", obj );
				return false;
			}
		}

		// Push the object into our data array
		tableData.rows.push( obj );

		// Check to see if a callback function is sent
		if( typeof callback === "function" ) {
			// Return the call back function and send the added object as a parameter
			return callback( obj );
		} else {
			// Else do nothing and return true.
			return true;
		}
	};

	this.remove = function ( index ) {

		// Splice and return the object from the tableData.rows array
		return tableData.rows.splice( index, 1 );

	};

	// Method to rebuild table
	this.refresh = function ( callback ) {

		// Get an array of objects {slug:dataType}
		var colTypes = columnTypes();

		// Get table data
		var rows = tableData.rows;

		// Set the container to nothing.
		this.container.innerHTML = "";

		// If showHeading in settings is true, add the thead, row and cells to make the header
		if( settings.showHeader === true ) {

			// Create thead element
			var tHead = document.createElement( "thead" );

			// Create the tr element
			var tHeadRow = document.createElement( "tr" );

			for( var c = 0; c < tableData.columns.length; c++ ) {

				// Create a new cell for each header
				var tHeadCell = document.createElement( "td" );

				// Add the display text for each header cell
				tHeadCell.innerHTML = tableData.columns[c].display;

				// Append each cell to the row
				tHeadRow.appendChild( tHeadCell );
			}

			// Append the row to the thead element
			tHead.appendChild( tHeadRow );

			// Append the thead element to the container
			this.container.appendChild( tHead );

		}

		// If there is no data, show a message there is nothing to display!
		if( tableData.rows.length < 1 ) {

			// Create a row for no data message
			var nothingRow = document.createElement( "tr" );

			// Create a cell for no data message
			var nothingCell = document.createElement( "td" );

			// Insert a string into the cell
			nothingCell.innerHTML = "Nothing to display!";

			// Set the colspan to span the full width of the table
			nothingCell.setAttribute( "colspan", tableData.columns.length );

			// Align the message to the center
			nothingCell.setAttribute( "style", "text-align: center;" );

			// Append the cell to the row
			nothingRow.appendChild( nothingCell );

			// Append the row to the table
			this.container.appendChild( nothingRow );

			// Send back false because the refresh did not have data to add
			return false;
		}

		// For every row
		for ( var i = 0; i < rows.length; i++ ) {
			// Establish rowData variable
			var rowData = rows[i];

			// Create table row DOM object
			var row = document.createElement( "tr" );

			for ( var col in rowData ) {

				// Create a new cell
				var cell = document.createElement( "td" );

				// If the typeof value is a function
				if ( typeof rowData[col] === "function" ) {

					// Run the function and get its return
					var result = rowData[col]( i, rowData );

					// If the return is an object
					if( typeof result === "object" ) {
						// We'll assume it is a DOM object and append it to the cell
						cell.appendChild( result );
					} else {
						// Otherwise we'll assume it can be added as a string
						cell.innerHTML = result;
					}

				// If the typeof the value is an object
				} else if ( typeof rowData[col] === "object") {

					// Assume it is a DOM object and attempt to append it to the column
					cell.appendChild( rowData[col] );

				// Finally assume the data is a string
				} else {

					// Set a data attribute at the cell level
					cell.setAttribute( "data-" + col, rowData[col] );

					// Add to the HTML string
					cell.innerHTML = rowData[col];

				}

				// Append the cell to the row
				row.appendChild( cell );

			}

			// Append the row to the container
			this.container.appendChild( row );

		}

		// Handle callback
		if ( typeof callback === "function" ) {
			return callback();
		} else {
			return true;
		}

	};

	// Not yet.
	this.edit = function () {
		return false;
	};

	// Returns a number as the sum of any one collumn or NaN
	this.columnTotal = function ( slug ) {

		// If the slug passed is not a column slug
		if( columnSlugs.indexOf( slug ) < 0 ) {

			// Throw an error
			console.error( "This column does not exist." );

			// Return false
			return false;

		}

		// Get the rows
		var data = tableData.rows;

		// Set an empty total variable
		var total = 0;

		// Add every value of each row's slug
		for ( var i = 0; i < data.length; i++ ) {
			total += data[i][slug];
		}

		// Return a forced number or NaN
		return Number( total );

	};

	// Returns the number of rows in the table
	this.length = function () {
		return tableData.rows.length;
	};

};

// Formats a number to a dollar value
var getUSD = function ( number ) {
	return "$" + number.toLocaleString( 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 } );
};

// Creates a button and returns the node
var removeButton = function ( index, object ) {
	var button = document.createElement( "button" );
		button.setAttribute( "onclick", "table.remove(" + index + "); table.refresh();" );
		button.setAttribute( "title", "Delete " + object.name );
		button.innerHTML = "Remove";
	return button;
};

// Calculates monthly salary
var monthlySalary = function ( index, object ) {
	return Math.round( object.salary / 12 );
};

// Sets the calculations in the HTML
var setTotals = function () {

	// Get each DOM field
	var totalYearly = document.getElementById( "totalYearlyExpenditure" );
	var totalMonthly = document.getElementById( "totalMonthlyExpenditure" );
	var averageSalary = document.getElementById( "averageSalary" );

	// Empty it.
	totalYearly.innerHTML	= "";
	totalMonthly.innerHTML	= "";
	averageSalary.innerHTML	= "";

	// Establish a variable for each calculation
	var totalSalary = table.columnTotal( "salary" );
	var monthly = Math.round( totalSalary / 12 );
	var average = totalSalary / table.length();

	// Set the innerHTML equal to each formatted calculation
	totalYearly.innerHTML	= getUSD( totalSalary );
	totalMonthly.innerHTML	= getUSD( monthly );
	averageSalary.innerHTML	= getUSD( average );

};

// Establish global variable for the table
var table;

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// Form submission handler
var submitForm = function () {

	// Set variables for form fields
	var employeeIdInput = document.getElementById( "employeeIdInput" );
	var firstNameInput = document.getElementById( "firstNameInput" );
	var lastNameInput = document.getElementById( "lastNameInput" );
	var jobTitleInput = document.getElementById( "jobTitleInput" );
	var salaryInput = document.getElementById( "salaryInput" );

	// Create a new employee object and prepare it for submission to the table data
	var newEmployee = {
		photo: "photo", // Could create a function to add a specific user photo
		id: employeeIdInput.value,
		firstName: firstNameInput.value,
		lastName: lastNameInput.value,
		jobTitle: jobTitleInput.value,
		salary: Number( salaryInput.value ),
		monthly: monthlySalary,
		actions: removeButton
	};

	// For each key in the newEmployee object
	for( var item in newEmployee ) {

		// If the value is undefined or empty
		if ( newEmployee[item] === undefined || newEmployee[item] === "" ) {

			// Alert the user that all fields are required
			alert( "All fields are required." );

			// Do not add the employee
			return false;

		}
	}

	// If the salary is a negative number
	if ( newEmployee.salary < 0 ) {

		// Alert the user the salary must be a positive number
		alert( "Employee Salary must be a positive number." );

		// Do not add the employee
		return false;

	}

	// Add the employee with a callback that clears the form
	table.add( newEmployee, function () {
		employeeIdInput.value = "";
		firstNameInput.value = "";
		lastNameInput.value = "";
		jobTitleInput.value = "";
		salaryInput.value = "";
	});

	// Refresh the table with a callback that sets the totals
	table.refresh( setTotals );

};

ready( function() {

	// This establishes the table's structure. The settings.
	table = new tableRunner( { 
		containerId: "tableDisplay",
		showHeader: true, // Bool: Show a thead element with a row and cell for each column
		columns: [ // Array of objects that contain a slug, display text and the allowable dataType
			{
				slug: "photo",
				display: "Photo",
				dataType: "string"
			},
			{
				slug: "id",
				display: "Employee ID",
				dataType: "string"
			},
			{
				slug: "firstName",
				display: "First Name",
				dataType: "string"
			},
			{
				slug: "lastName",
				display: "Last Name",
				dataType: "string"
			},
			{
				slug: "jobTitle",
				display: "Job Title",
				dataType: "string"
			},
			{
				slug: "salary",
				display: "Salary",
				dataType: "number"
			},
			{
				slug: "monthly",
				display: "Monthly Salary",
				dataType: "function"
			},
			{
				slug: "actions",
				display: "Actions",
				dataType: "function"
			}
			]

	} );

	// Refresh the table in case data was added, set totals from the data as a callback
	table.refresh( setTotals );

} );